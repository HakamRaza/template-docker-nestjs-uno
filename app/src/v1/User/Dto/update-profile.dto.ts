// Nest dependencies
import { ApiPropertyOptional } from "@nestjs/swagger";
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
import { FileAttachmentDto } from "src/shared/Dto/file-attachment.dto";

export class UpdateProfileDto {

	@ApiPropertyOptional({
		example: 'Hoo Lew Key',
	})
	@IsOptional()
	@Transform(({ value }) => value.trim().toUpperCase())
	@Type(() => String)
	@IsString()
	@Length(5, 200)
    fullname: string;

	@ApiPropertyOptional({
		example: 'Bukit Bintang, 57000, KL',
	})
	@IsOptional()
	@Transform(({ value }) => value.trim().toUpperCase())
	@Type(() => String)
	@IsString()
	@Length(5, 200)
    address: string;

	@ApiPropertyOptional({
		required: true,
		example: {}
	})
	@IsOptional()
	@IsNotEmptyObject()
	@ValidateNested({
		message: 'Undefined image file attached.',
	})
	imagefile: FileAttachmentDto;
}
