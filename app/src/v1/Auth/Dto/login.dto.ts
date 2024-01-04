// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

// Other dependencies
import {
	IsAlphanumeric,
	IsNotEmpty,
	IsString,
	Length,
	MinLength,
	NotContains,
} from 'class-validator';

export class LoginDto {
	@ApiProperty({
		example: 'myuser123',
	})
	@Transform(({ value }) => value.trim().toLowerCase())
	@Type(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@NotContains(' ')
	username: string;

	@ApiProperty({
		example: 'password123',
	})
	@Type(() => String)
	@IsString()
	@IsAlphanumeric()
	@IsNotEmpty()
	@NotContains(' ')
	@Length(5, 100)
	password: string;
}
