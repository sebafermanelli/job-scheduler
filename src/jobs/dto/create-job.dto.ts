import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateJobDto {
  @ApiProperty({
    description: 'The URL to send the webhook',
    example: 'https://example.com/webhook',
  })
  @IsString()
  webhookUrl: string;

  @ApiProperty({
    description: 'The scheduled date for the event',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDate()
  nextRunAt: Date;

  @ApiProperty({
    description: 'The payload to send in the webhook as the body (optional)',
    example: '{}',
  })
  @IsObject()
  @IsOptional()
  payload?: object;
}
