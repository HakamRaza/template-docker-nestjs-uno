// Nest dependencies
import {
	Injectable,
	BadRequestException,
	ForbiddenException,
	ConflictException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { ApiTags } from '@nestjs/swagger';

// Other dependencies
import { randomBytes } from 'crypto';
import * as argon2 from 'argon2'

// Local files
import { UserRepository } from 'src/shared/Repositories/user.repository';
import { UserEntity } from 'src/shared/Entities/user.entity';
import { SessionTokenRepository } from 'src/shared/Repositories/session-token.repository';
import { RegisterDto } from '../Dto/register.dto';
import { MailService } from 'src/shared/Services/mail.service';
import { LoginDto } from '../Dto/login.dto';
import { JwtPayloadBody } from 'src/shared/Types/jwt-payload-body.type';
import { jwtAddonService } from 'src/shared/Services/jwt-manipulation.service';
import { JWT_ROLE, JWT_SESSION_TOKEN, JWT_USER_ID } from 'src/shared/Constant';


@ApiTags('v1/auth')
@Injectable()
export class AuthService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly sessionTokenRepository: SessionTokenRepository,
		private readonly jwtService: JwtService,
		private readonly mailService: MailService,
	) {}

	async signup(dto: RegisterDto): Promise<UserEntity> {
		// check email exist or username exist
		const isExist = await this.userRepository.isEmailExist(dto.email);
		if (isExist) throw new ConflictException('Email or username is unavailable.')

		// register new user
		const user = await this.userRepository.addNew(dto);
		
		// send welcome mail
		await this.mailService.sendWelcomeMail(user.email).catch((_err) => {
			console.error(_err);
			throw new BadRequestException('SMTP transport failed');
		});

		return user;
	}

	async login(dto: LoginDto): Promise<[UserEntity, string]> {
		// find user
		const user = await this.userRepository.findUserByEmail(dto.username);
		// check user is banned
		if (user.is_banned) throw new ForbiddenException('Account has been banned. Please contact support for further details.')

		// check password passed
		let isVerified = await argon2.verify(user.password, dto.password)
		if (!isVerified) throw new BadRequestException('User could not found by given credentials.')

		// generate access token
		const jwt: JwtPayloadBody = {
			nbf: Math.floor(Date.now() / 1000) + (60 * 60),
			[JWT_ROLE]: user.role,
			[JWT_USER_ID]: '' + user.id,
			[JWT_SESSION_TOKEN]: randomBytes(10).toString('hex'),
		}
		
		const access_token = this.jwtService.sign(jwt);
		
		// record token
		await this.sessionTokenRepository.assignSession(jwt) // save token to DB
		
		return [ user, access_token ]
	}

	async logout(bearer: string): Promise<void> {
		// extract user id from 'sub'
		const userId = jwtAddonService.getTokenSubProperty(bearer, JWT_USER_ID);

		// delete session tokens
		return this.sessionTokenRepository.removeAllToken(userId)
	}
}
