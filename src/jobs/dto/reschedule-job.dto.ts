import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';

export class RescheduleJobDto {
  @ApiProperty({
    description: 'The new scheduled date for the event',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDate()
  nextRunAt: Date;
}
