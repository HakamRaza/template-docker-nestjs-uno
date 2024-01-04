// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import { Type } from 'class-transformer';
import { IsNotEmpty, IsInt } from 'class-validator';

export class SingleIDDto {
	@ApiProperty({
		example: 4,
	})
	@Type(() => Number)
	@IsInt()
	@IsNotEmpty()
	id: number;
}
