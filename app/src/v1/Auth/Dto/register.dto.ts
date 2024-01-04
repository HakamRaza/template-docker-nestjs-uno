// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

// Other dependencies
import {
	IsAlphanumeric,
	IsEmail,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsString,
	Length,
	MinLength,
	NotContains,
} from 'class-validator';

// local files
import { RolesEnum } from 'src/shared/Enums/roles.enums';

export class RegisterDto {
	@ApiProperty({
		example: 'demo_user@email.com',
	})
	@Transform(({ value }) => value.trim().toLowerCase())
	@Type(() => String)
	@IsEmail()
	@IsNotEmpty()
	@MinLength(10)
	email: string;

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

	@ApiProperty({
		example: RolesEnum.admin,
		enum: Object.values(RolesEnum),
	})
	@Type(() => Number)
	@IsInt()
	@IsEnum(Object.values(RolesEnum))
	role: number;
}
