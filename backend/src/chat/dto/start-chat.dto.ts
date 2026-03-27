import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Body is optional – the Express original accepted an empty POST body.
 * We preserve that behaviour (is_anonymous defaults to true).
 */
export class StartChatDto {
  @ApiPropertyOptional({
    example: true,
    default: true,
    description: 'Whether to start the session in anonymous mode',
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => value !== false && value !== 'false')
  @IsBoolean()
  is_anonymous?: boolean;
}
