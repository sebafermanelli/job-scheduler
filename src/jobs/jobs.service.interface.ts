import { Agenda, Job } from 'agenda';
import { CreateJobDto } from './dto/create-job.dto';
import { RescheduleJobDto } from './dto/reschedule-job.dto';

export interface JobsServiceInterface {
  /**
   * Create the agenda instance and define the job
   */
  createAgenda(): Promise<Agenda>;

  /**
   * Schedule a job to be sent at a specific time
   * @param jobData - The data to send in the job
   * @returns The job
   */
  schedule(jobData: CreateJobDto): Promise<Job>;

  /**
   * Find all jobs
   * @returns The jobs or an empty array if no jobs were found
   */
  findAll(): Promise<Job[]>;

  /**
   * Find a job by its ID
   * @param id - The ID of the job to find
   * @returns The job or null if no job was found
   */
  findById(id: string): Promise<Job | null>;

  /**
   * Reschedule a job by its ID
   * @param id - The ID of the job to reschedule
   * @param jobData - The data to reschedule the job
   * @returns The rescheduled job
   */
  reschedule(id: string, jobData: RescheduleJobDto): Promise<Job>;

  /**
   * Cancel a job by its ID
   * @param id - The ID of the job to cancel
   * @returns The number of jobs cancelled or undefined if no jobs were cancelled
   */
  cancel(id: string): Promise<number | undefined>;
}
