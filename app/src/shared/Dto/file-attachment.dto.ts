// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import { MaxLength, IsNotEmpty, IsInt } from 'class-validator';

export class FileAttachmentDto {
	@ApiProperty({
		required: true,
		example: Buffer.from('€'),
	})
	@IsNotEmpty()
	decoded: Buffer;

	@ApiProperty({
		required: true,
		example: 1000,
	})
	@IsNotEmpty()
	@IsInt()
	filesize: number;

	@ApiProperty({
		required: true,
		example: 'my files.pdf', // file name
	})
	@IsNotEmpty()
	@MaxLength(100)
	filename: string;

	@ApiProperty({
		required: true,
		example: 'application/pdf',
	})
	@IsNotEmpty()
	mimetype: string;
}
