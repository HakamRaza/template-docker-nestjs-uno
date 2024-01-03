// Nest dependencies
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";

// Other dependencies
import {
	IsAlphanumeric,
	IsEmail,
	IsNotEmpty,
	IsString,
	Length,
	MinLength,
	NotContains
} from "class-validator";

export class RegisterDto {
	@ApiProperty({
		example: 'myuser123',
	})
	@Transform(({ value }) => value.trim().toLowerCase())
	@Type(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@NotContains(' ')
	username: string

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
}
