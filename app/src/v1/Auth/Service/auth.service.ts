// Nest dependencies
import {
	Injectable,
	BadRequestException,
	ForbiddenException,
	ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { InjectQueue } from '@nestjs/bull';

// Other dependencies
import { randomBytes } from 'crypto';
import * as argon2 from 'argon2';
import { Queue } from 'bull';

// Local files
import { UserRepository } from 'src/shared/Repositories/user.repository';
import { UserEntity } from 'src/shared/Entities/user.entity';
import { SessionTokenRepository } from 'src/shared/Repositories/session-token.repository';
import { RegisterDto } from '../Dto/register.dto';
import { LoginDto } from '../Dto/login.dto';
import { JwtPayloadBody } from 'src/shared/Types/jwt-payload-body.type';
import { jwtAddonService } from 'src/shared/Services/jwt-manipulation.service';
import { JWT_ROLE, JWT_SESSION_TOKEN, JWT_USER_ID } from 'src/shared/Constant';
import { Transactional } from 'typeorm-transactional';
import { serializerService } from 'src/shared/Services/serializer.service';

@ApiTags('v1/auth')
@Injectable()
export class AuthService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly sessionTokenRepository: SessionTokenRepository,
		private readonly jwtService: JwtService,
		@InjectQueue('emailQueue') private readonly emailQueue: Queue,
	) {}

	@Transactional()
	async signup(dto: RegisterDto): Promise<UserEntity> {
		// check email exist or username exist
		const isExist = await this.userRepository.isEmailExist(dto.email);
		if (isExist) throw new ConflictException('Email or username is unavailable.');

		// register new user
		const user = await this.userRepository.addNew(dto);

		await this.emailQueue.add('welcome', {
			to: user.email,
		});

		return user;
	}

	async login(dto: LoginDto): Promise<[UserEntity, string]> {
		// find user
		const user = await this.userRepository.findUserByEmail(dto.email);
		// check user is banned
		if (user.is_banned) throw new ForbiddenException('Account has been banned. Please contact support for further details.');

		// check password passed
		const isVerified = await argon2.verify(user.password, dto.password);
		if (!isVerified) throw new BadRequestException('User could not found by given credentials.');

		// generate access token
		const jwt: JwtPayloadBody = {
			nbf: Math.floor(Date.now() / 1000),
			[JWT_ROLE]: user.role,
			[JWT_USER_ID]: '' + user.id,
			[JWT_SESSION_TOKEN]: randomBytes(10).toString('hex'),
		};

		const access_token = this.jwtService.sign(jwt);

		// record token
		await this.sessionTokenRepository.assignSession(jwt); // save token to DB
		await serializerService.deleteProperties(user, ['password'])
		
		return [user, access_token];
	}

	async logout(bearer: string): Promise<void> {
		// extract user id from 'sub'
		const userId = jwtAddonService.getTokenSubProperty(bearer, JWT_USER_ID);

		// delete session tokens
		return this.sessionTokenRepository.removeAllToken(userId);
	}
}
