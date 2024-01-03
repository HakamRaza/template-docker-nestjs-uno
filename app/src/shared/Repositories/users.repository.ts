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
import { UserEntity } from '../Entities/user.entity';
import { RegisterDto } from 'src/v1/Auth/Dto/register.dto';

@Injectable()
export class UsersRepository extends Repository<UserEntity> {
	constructor(private dataSource: DataSource) {
		super(UserEntity, dataSource.createEntityManager());
	}

	async isUsernameOrEmailExist(username:string, email:string): Promise<boolean> {
		try {
			let anyExist = await this.count({ 
				where: [
					{ username },
					{ email}
				]
			});
			return (anyExist > 0);
		} catch (error) {
			console.error(error);
			throw new BadRequestException()
		}
	}

	async addNew(dto: RegisterDto): Promise<UserEntity> {
		try {
			const newUser: UserEntity = this.create({
				username: dto.username,
				password: dto.password,
				email: dto.email,
				role: dto.role
			})

			return await this.save(newUser);
		} catch (error) {
			console.error(error);
			throw new BadRequestException('Failed to register user')
		}
	}

	async findUser(username: string): Promise<UserEntity> {
		try {
			return this.findOneOrFail({
				select: {
					username: true,
					password: true,
					is_banned: true,
					role: true,
				},
				where: {
					username
				},
			});
		} catch (error) {
			console.error(error);
			throw new NotFoundException('User could not found by given credentials.');
		}
	}
}