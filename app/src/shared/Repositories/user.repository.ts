// Nest dependencies
import {
	BadRequestException,
	NotFoundException,
	Injectable,
} from '@nestjs/common';

// Other dependencies
import { DataSource, Repository } from 'typeorm';

// Local files
import { UserEntity } from '../Entities/user.entity';
import { RegisterDto } from 'src/v1/Auth/Dto/register.dto';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
	constructor(private dataSource: DataSource) {
		super(UserEntity, dataSource.createEntityManager());
	}

	async isEmailExist(email:string): Promise<boolean> {
		try {
			return await this.exist({ 
				where: { 
					email: email
				}
			});
		} catch (error) {
			console.error(error);
			throw new BadRequestException()
		}
	}

	async addNew(dto: RegisterDto): Promise<UserEntity> {
		try {
			const newUser: UserEntity = this.create({
				email: dto.email,
				password: dto.password,
				role: dto.role
			})

			return await this.save(newUser);
		} catch (error) {
			console.error(error);
			throw new BadRequestException('Failed to register user')
		}
	}

	async findUserByEmail(email: string): Promise<UserEntity> {
		try {
			return this.findOneOrFail({
				select: {
					id: true,
					email: true,
					password: true,
					is_banned: true,
					role: true,
				},
				where: { email },
			});
		} catch (error) {
			console.error(error);
			throw new NotFoundException('User could not found');
		}
	}
}