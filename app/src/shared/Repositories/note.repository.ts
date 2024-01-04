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
import { PageOptionsDto } from '../Dto/page-options.dto';
import { AddNoteDto } from 'src/v1/User/Dto/add-note.dto';

@Injectable()
export class NoteRepository extends Repository<NoteEntity> {
	constructor(private dataSource: DataSource) {
		super(NoteEntity, dataSource.createEntityManager());
	}

	async findNotes(query: PageOptionsDto, fetchAll: boolean = false): Promise<[NoteEntity[], number]> {
		try {
			return await this.findAndCount({
				select: {
					userData: {
						id: true,
						email: true,
					}
				},
				where: {
					userData: {
						is_banned: false,
					}
				},
				relations: {
					userData: true,
				},
				order: {
					updated_at: query.order,
				},
				...(fetchAll
					? {}
					: { skip: query.skip, take: query.take }
				)
			})
		} catch (error) {
			console.error(error);
			throw new BadRequestException('Failed to fetch notes')
		}
	}

	async addNew(userId: number, dto: AddNoteDto): Promise<NoteEntity> {		
		try {
			const newNote: NoteEntity = this.create({
				user_id: userId,
				title: dto.title,
				description: dto.description
			});

			return await this.save(newNote);
		} catch (error) {
			console.error(error);
			throw new BadRequestException('Failed to add note')
		}
	}

	async removeById(noteId: number): Promise<void> {
		try {
			await this.delete({ id: noteId });
		} catch (error) {
			console.error(error);
			throw new UnprocessableEntityException('Failed to remove note.');
		}
	}
}