// Nest dependencies
import { Injectable } from '@nestjs/common';

// Other dependencies

// Local files
import { NoteRepository } from 'src/shared/Repositories/note.repository';
import { jwtAddonService } from 'src/shared/Services/jwt-manipulation.service';
import { JWT_USER_ID } from 'src/shared/Constant';
import { ProfileRepository } from 'src/shared/Repositories/profile.repository';
import { UpdateProfileDto } from '../Dto/update-profile.dto';
import { ProfileEntity } from 'src/shared/Entities/profile.entity';
import { PageOptionsDto } from 'src/shared/Dto/page-options.dto';
import { NoteEntity } from 'src/shared/Entities/note.entity';
import { AddNoteDto } from '../Dto/add-note.dto';
import { serializerService } from 'src/shared/Services/serializer.service';

@Injectable()
export class UserService {
	constructor(
		private readonly noteRepository: NoteRepository,
		private readonly profileRepository: ProfileRepository,
	) { }

	//------------------------------ Profile ----------------------------------

	async getProfile(userId: number): Promise<ProfileEntity> {
		return this.profileRepository.findByUserId(userId);
	}

	async getOwnProfile(bearer: string): Promise<ProfileEntity> {
		// extract user_id from 'sub' token
		const userId = await jwtAddonService.getTokenSubProperty(bearer, JWT_USER_ID);

		return this.getProfile(userId);
	}

	async updateOrCreateOwnProfile(
		bearer: string,
		dto: UpdateProfileDto,
	): Promise<ProfileEntity> {
		// extract user_id from 'sub' token
		const userId = await jwtAddonService.getTokenSubProperty(bearer, JWT_USER_ID);

		const profile = await this.profileRepository.addOrCreateNew(userId, dto);

		await serializerService.deleteProperties(profile, ['image_buffer', 'image_size', 'image_name']);

		return profile;
	}

	//------------------------------ Notes ----------------------------------

	async getNoteList(
		query: PageOptionsDto,
		fetchAll = false,
	): Promise<[NoteEntity[], number]> {
		return this.noteRepository.findNotes(query, fetchAll);
	}

	async addNote(bearer: string, dto: AddNoteDto): Promise<NoteEntity> {
		// extract user_id from 'sub' token
		const userId = await jwtAddonService.getTokenSubProperty(bearer, JWT_USER_ID);

		return this.noteRepository.addNew(userId, dto);
	}

	async removeNote(noteId: number): Promise<void> {
		return await this.noteRepository.removeById(noteId);
	}
}
