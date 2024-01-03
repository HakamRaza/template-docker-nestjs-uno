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

@Injectable()
export class ProfileRepository extends Repository<ProfileEntity> {
	constructor(private dataSource: DataSource) {
		super(ProfileEntity, dataSource.createEntityManager());
	}
}