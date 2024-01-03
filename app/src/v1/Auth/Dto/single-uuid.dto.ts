// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import { Type } from 'class-transformer';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class SingleUUIDDto {
	@ApiProperty({
		example: '423d2a79-14c4-4620-943b-e36558225d8a',
	})
	@Type(() => String)
	@IsUUID()
	@IsNotEmpty()
	uuid: string;
}
