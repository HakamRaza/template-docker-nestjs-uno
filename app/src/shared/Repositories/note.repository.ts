// Nest dependencies
import {
	BadRequestException,
	NotFoundException,
	Injectable,
	UnprocessableEntityException,
} from '@nestjs/common';

// Other dependencies
import { DataSource, Repository } from 'typeorm';

// Local files
import { NoteEntity } from '../Entities/note.entity';

@Injectable()
export class NoteRepository extends Repository<NoteEntity> {
	constructor(private dataSource: DataSource) {
		super(NoteEntity, dataSource.createEntityManager());
	}
}