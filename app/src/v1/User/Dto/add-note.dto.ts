// Nest dependencies
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";

// Other dependencies
import {
	IsNotEmpty,
	IsNotEmptyObject,
	IsOptional,
	IsString,
	Length,
	ValidateNested
} from "class-validator";

// local files

export class AddNoteDto {
    @ApiProperty({
		example: 'My Title.',
	})
	@Type(() => String)
	@IsString()
	@IsNotEmpty()
	@Length(5, 100)
    title: string

    @ApiProperty({
		example: 'This is my note.',
	})
	@Type(() => String)
	@IsString()
	@IsNotEmpty()
	@Length(5, 300)
    description: string
}
