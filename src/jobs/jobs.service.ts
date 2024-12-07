import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JobsServiceInterface } from './jobs.service.interface';
import { Agenda, Job } from 'agenda';
import { WebhookService } from '../utils/webhook/webhook.service';
import { Types } from 'mongoose';
import { CreateJobDto } from './dto/create-job.dto';
import { RescheduleJobDto } from './dto/reschedule-job.dto';

@Injectable()
export class JobsService implements OnModuleInit, JobsServiceInterface {
  private agenda: Agenda;

  constructor(
    private readonly configService: ConfigService,
    private readonly webhookService: WebhookService,
  ) {}

  async onModuleInit() {
    this.agenda = await this.createAgenda();
    Logger.log(
      'Agenda initialized successfully to schedule jobs 📅',
      JobsService.name,
    );
  }

  async createAgenda(): Promise<Agenda> {
    const mongoConnectionString = this.configService.get('MONGODB_URI');

    const agenda = new Agenda({
      db: {
        address: mongoConnectionString,
        collection: 'agenda_jobs',
      },
    });

    agenda.define('webhook', async (job: Job) => {
      const { webhookUrl, payload } = job.attrs.data;

      job.setShouldSaveResult(true);
      await job.save();

      try {
        const result = await this.webhookService.sendWebhook(
          webhookUrl,
          payload,
        );
        job.attrs.result = result;
        await job.save();
      } catch (error) {
        throw error;
      }
    });

    await agenda.start();
    return agenda;
  }

  async schedule(jobData: CreateJobDto): Promise<Job> {
    const job = await this.agenda.schedule(jobData.nextRunAt, 'webhook', {
      webhookUrl: jobData.webhookUrl,
      payload: jobData.payload,
    });
    if (!job) throw new InternalServerErrorException('Failed to schedule job');
    return job;
  }

  async findAll(): Promise<Job[]> {
    return await this.agenda.jobs();
  }

  async findById(id: string): Promise<Job> {
    const jobs = await this.agenda.jobs({ _id: new Types.ObjectId(id) });
    if (!jobs[0]) throw new NotFoundException('Job not found');
    return jobs[0];
  }

  async reschedule(id: string, jobData: RescheduleJobDto): Promise<Job> {
    const jobs = await this.agenda.jobs({ _id: new Types.ObjectId(id) });
    if (!jobs[0]) throw new NotFoundException('Job not found');
    jobs[0].attrs.nextRunAt = jobData.nextRunAt;
    return await jobs[0].save();
  }

  async cancel(id: string): Promise<number> {
    const result = await this.agenda.cancel({ _id: new Types.ObjectId(id) });
    if (!result) throw new NotFoundException('Job not found');
    return result;
  }
}
