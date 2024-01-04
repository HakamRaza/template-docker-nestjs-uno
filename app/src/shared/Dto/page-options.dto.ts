// Nest dependencies
import { ApiPropertyOptional } from '@nestjs/swagger';

// Other dependencies
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

/**
 * Declare page order enum
 */
enum PageOrder {
	ASC = 'ASC',
	DESC = 'DESC',
}

export class PageOptionsDto {
	@ApiPropertyOptional({ enum: PageOrder, default: PageOrder.ASC })
	@IsEnum(PageOrder)
	@IsOptional()
	readonly order?: PageOrder = PageOrder.ASC;

	@ApiPropertyOptional({
		minimum: 1,
		default: 1,
	})
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@IsOptional()
	readonly page?: number = 1;

	@ApiPropertyOptional({
		minimum: 1,
		maximum: 50,
		default: 10,
	})
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(50)
	@IsOptional()
	readonly take?: number = 10;

	get skip(): number {
		return (this.page - 1) * this.take;
	}
}
