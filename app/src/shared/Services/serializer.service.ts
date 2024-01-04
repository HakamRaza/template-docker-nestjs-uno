import { PageOptionsDto } from '../Dto/page-options.dto';

/**
 * Declare data structure Typescript
 */
export declare interface ISerializeResponse {
	type: string;
	id?: number;
	data: {
		[key: string]: any;
	};
	metadata?: {
		page: number;
		take: number;
		itemCount: number;
		pageCount: number;
		hasPreviousPage: boolean;
		hasNextPage: boolean;
	};
}

/**
 * Modify response
 */
export class SerializerService {
	// Remove identified unnecessary details from query
	public async deleteProperties(
		data: object,
		properties: string[],
	): Promise<object> {
		for await (const property of properties) {
			delete data[property];
		}

		return data;
	}

	public assignPropNameToPropValue(
		data: Array<{ [key: string]: any; name: string; value: any }>,
	): Object {
		const json = {};

		data.forEach((data) => {
			json[data.name] = data.value;
		});

		return json;
	}

	// Unifromise data details from query
	public serializeResponse(
		type: string,
		data: object,
		id?: number,
	): ISerializeResponse {
		return {
			type,
			id,
			data,
		};
	}

	// Unifromise data details from paginated query
	public paginateResponse(
		type: string,
		data: Array<object> | Object,
		pageOptionsDto: PageOptionsDto,
		itemCount: number,
		id?: number,
	): ISerializeResponse {
		const page = Number(pageOptionsDto.page);
		const take = Number(pageOptionsDto.take);
		const pageCount = Math.ceil(itemCount / take);

		return {
			type,
			id,
			data,
			metadata: {
				page,
				take,
				itemCount,
				pageCount,
				hasPreviousPage: page > 1,
				hasNextPage: page < pageCount,
			},
		};
	}
}

export const serializerService = new SerializerService();
