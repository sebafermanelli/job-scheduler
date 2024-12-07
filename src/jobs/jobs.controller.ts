import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { RescheduleJobDto } from './dto/reschedule-job.dto';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Job } from 'agenda';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ApiOperation({ summary: 'Create a new job' })
  @UseGuards(ApiKeyGuard)
  @Post()
  async createJob(@Body() createJobDto: CreateJobDto): Promise<Job> {
    try {
      const createdJob = await this.jobsService.schedule(createJobDto);

      Logger.log(
        `Job ${createdJob.attrs._id} scheduled at ${createdJob.attrs.nextRunAt} 📅`,
        JobsController.name,
      );
      return createdJob;
    } catch (error) {
      Logger.error(error, JobsController.name);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  @ApiOperation({ summary: 'Get all jobs' })
  @UseGuards(ApiKeyGuard)
  @Get()
  async getAllJobs(): Promise<{
    total: number;
    pending: number;
    completed: number;
    failed: number;
    jobs: Job[];
  }> {
    try {
      const jobs = await this.jobsService.findAll();

      return {
        total: jobs.length,
        pending: jobs.filter((job) => !job.attrs.result && !job.attrs.failedAt)
          .length,
        completed: jobs.filter((job) => job.attrs.result).length,
        failed: jobs.filter((job) => job.attrs.failedAt).length,
        jobs,
      };
    } catch (error) {
      Logger.error(error, JobsController.name);
      throw new InternalServerErrorException(error);
    }
  }

  @ApiOperation({ summary: 'Get a job by id' })
  @UseGuards(ApiKeyGuard)
  @Get(':id')
  async getJobById(@Param('id') id: string): Promise<Job> {
    try {
      return await this.jobsService.findById(id);
    } catch (error) {
      Logger.error(error, JobsController.name);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  @ApiOperation({ summary: 'Reschedule a job by id' })
  @UseGuards(ApiKeyGuard)
  @Patch('reschedule/:id')
  async rescheduleJob(
    @Param('id') id: string,
    @Body() rescheduleJobDto: RescheduleJobDto,
  ): Promise<Job> {
    try {
      const updatedJob = await this.jobsService.reschedule(
        id,
        rescheduleJobDto,
      );

      Logger.log(
        `Job ${id} rescheduled at ${updatedJob.attrs.nextRunAt} 📅`,
        JobsController.name,
      );
      return updatedJob;
    } catch (error) {
      Logger.error(error, JobsController.name);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  @ApiOperation({ summary: 'Delete a job by id' })
  @UseGuards(ApiKeyGuard)
  @Delete(':id')
  async deleteJob(@Param('id') id: string): Promise<string> {
    try {
      await this.jobsService.cancel(id);

      const message = `Job ${id} cancelled 🗑️`;

      Logger.log(message, JobsController.name);
      return message;
    } catch (error) {
      Logger.error(error, JobsController.name);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
