// Nest dependencies
import { APP_GUARD } from '@nestjs/core'
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Local files
import { UsersRepository } from 'src/shared/Repositories/users.repository';
import { RolesGuard } from 'src/shared/Guards/roles.guard';
import { JwtStrategy } from './Strategy/jwt.strategy';
import { configService } from 'src/shared/Services/config.service';
import { AuthService } from './Service/auth.service';
import { AuthController } from './Controller/auth.controller';
import { MailService } from 'src/shared/Services/mail.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			UsersRepository,
		]),
		PassportModule.register({ defaultStrategy: 'jwt' }), // Authentication
		JwtModule.registerAsync({
			useFactory: () => {
				return {
					secret: configService.getEnv('JWT_SECRET_FOR_ACCESS_TOKEN'),
					signOptions: {
						...({ expiresIn: configService.getEnv('JWT_EXPIRATION_TIME') }),
					},
				}
			},
		}), // Authentication
	],
	controllers: [
		AuthController
	],
	providers: [
		AuthService,
		MailService,
		UsersRepository,
		JwtStrategy, // Authentication
		{
			provide: APP_GUARD,
			useClass: RolesGuard
		} // Authorization (Based on Role)
	],
})
export class AuthModule { }
