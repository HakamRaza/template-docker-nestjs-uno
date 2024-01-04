// Nest dependencies
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

// Other dependencies
import { ExtractJwt, Strategy } from 'passport-jwt';

// Local files
import { configService } from 'src/shared/Services/config.service';
import { JwtPayloadBody } from 'src/shared/Types/jwt-payload-body.type';
import { SessionTokenRepository } from 'src/shared/Repositories/session-token.repository';

/**
 | A chain of strategies for authentication to go througth. Different than role 
 | guard which check role JWT is valid and role exist, authentication strategy
 | bind JWT to user itself. You can use Req.user to extract user info pass 
 | from here. It does not care about Role as long as User can be found.
 | 
 | You can use both Role and JWT together.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly sessionTokenRepository: SessionTokenRepository,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.getEnv('JWT_SECRET_FOR_ACCESS_TOKEN'),
			ignoreExpiration: false,
		});
	}

	async validate(dto: JwtPayloadBody): Promise<any> {
		const sessionToken = await this.sessionTokenRepository.getUserSession(
			dto,
		); // check session validity with DB

		if (sessionToken.userData.is_banned)
			throw new UnauthorizedException(
				'Account has been disabled. Please contact administrator.',
			);

		await this.sessionTokenRepository.updateCurrentSession(dto); // updated last used at

		// bind data to Req.user if using default Express but not for Fastify. So sending dumb data.
		return { craftedBy: 'HR2023' };
	}
}
