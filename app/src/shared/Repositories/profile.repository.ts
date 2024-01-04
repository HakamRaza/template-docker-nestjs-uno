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
import { ProfileEntity } from '../Entities/profile.entity';
import { UpdateProfileDto } from 'src/v1/User/Dto/update-profile.dto';

@Injectable()
export class ProfileRepository extends Repository<ProfileEntity> {
	constructor(private dataSource: DataSource) {
		super(ProfileEntity, dataSource.createEntityManager());
	}

	async findByUserId(userId: number): Promise<ProfileEntity> {
		try {
			return await this.findOneOrFail({
				select: {
					user_id: true,
					fullname: true,
					address: true,
				},
				where: { user_id: userId },
			});
		} catch (error) {
			console.error(error);
			throw new NotFoundException('Profile could not be found.');
		}
	}

	async addOrCreateNew(
		userId: number,
		dto: UpdateProfileDto,
	): Promise<ProfileEntity> {
		const exist = this.exist({
			where: {
				user_id: userId,
			},
		});

		if (!exist && !dto.fullname) throw new BadRequestException('Full name is needed to create profile.');

		try {
			const profile: ProfileEntity = this.create({
				user_id: userId,
				fullname: dto.fullname,
				image_name: dto.imagefile ? dto.imagefile.filename : null,
				image_size: dto.imagefile ? dto.imagefile.filesize : null,
				image_buffer: dto.imagefile ? dto.imagefile.decoded : null,
				address: dto.address || null,
			});

			if (exist) await this.update({ user_id: userId }, profile)
			else await this.insert(profile);

			return profile;

		} catch (error) {
			console.error(error);
			throw new BadRequestException('Failed to save profile');
		}
	}
}
