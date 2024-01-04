// Nest dependencies
import {
	BadRequestException,
	UnprocessableEntityException,
	NotFoundException,
	ForbiddenException,
	UnauthorizedException,
	Injectable,
} from '@nestjs/common';

// Other dependencies
import { DataSource, Repository } from 'typeorm';

// Local files
import { SessionTokenEntity } from '../Entities/session-token.entity';
import { JwtPayloadBody } from '../Types/jwt-payload-body.type';

@Injectable()
export class SessionTokenRepository extends Repository<SessionTokenEntity> {
	constructor(private dataSource: DataSource) {
		super(SessionTokenEntity, dataSource.createEntityManager());
	}

	async getUserSession(dto: JwtPayloadBody): Promise<SessionTokenEntity> {
		try {
			// find token x user id in session
			return await this.findOneOrFail({
				select: {
					user_id: true, // need true to use where
					token: true, // need true to use where
					userData: {
						is_banned: true,
					},
				},
				where: {
					user_id: parseInt(dto.sub),
					token: dto.jti,
				},
				relations: ['userData'],
			});
		} catch (error) {
			console.error(error);
			throw new UnauthorizedException('Invalid session token');
		}
	}

	async updateCurrentSession(dto: JwtPayloadBody): Promise<void> {
		try {
			await this.update(
				{ token: dto.jti, user_id: parseInt(dto.sub) },
				{ last_use_at: () => 'NOW()' },
			);
		} catch (error) {
			console.error(error);
			throw new UnprocessableEntityException('Failed to update session');
		}
	}

	async removeAllToken(userId: number): Promise<void> {
		try {
			await this.delete({ user_id: userId }); // remove all old token
		} catch (error) {
			console.error(error);
			throw new UnprocessableEntityException('Failed to remove tokens.');
		}
	}

	async addToken(userId: number, token: string): Promise<void> {
		await this.insert({ user_id: userId, token: token }); // save new token
	}

	async assignSession(dto: JwtPayloadBody): Promise<void> {
		try {
			await this.removeAllToken(parseInt(dto.sub));
			await this.addToken(parseInt(dto.sub), dto.jti);
		} catch (error) {
			console.error(error);
			throw new BadRequestException('Failed to update session');
		}
	}
}
