// Nest dependencies
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Other dependencies
import * as env from 'dotenv';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { RedisOptions } from 'ioredis';

// Local files
import { UserEntity } from '../Entities/user.entity';
import { SessionTokenEntity } from '../Entities/session-token.entity';
import { ResetPasswordEntity } from '../Entities/reset-password.entity';
import { ProfileEntity } from '../Entities/profile.entity';
import { NoteEntity } from '../Entities/note.entity';

env.config();

export class ConfigService {
	public getEnv(key: string): any {
		return process.env[key];
	}

	public isProduction(): boolean {
		return (this.getEnv('MODE') + '').toLowerCase().startsWith('prod');
	}

	public getTypeOrmConfig(): TypeOrmModuleOptions {
		return {
			type: 'postgres',
			host: this.getEnv('POSTGRES_HOST'),
			port: this.getEnv('POSTGRES_PORT'),
			username: this.getEnv('POSTGRES_USER'),
			password: this.getEnv('POSTGRES_PASSWORD'),
			database: this.getEnv('POSTGRES_DB'),
			entities: [
				// __dirname + '/../**/*.entity.ts'
				UserEntity,
				ProfileEntity,
				ResetPasswordEntity,
				SessionTokenEntity,
				NoteEntity,
			],
			synchronize: !this.isProduction(),
			ssl: false,
		};
	}

	public getMailConfig(): SMTPTransport.Options {
		return {
			service: configService.getEnv('SMTP_SERVICE'),
			host: configService.getEnv('SMTP_HOST'),
			port: configService.getEnv('SMTP_PORT'),
			secure: configService.getEnv('SMTP_SERVICE') !== 'mailtrap',
			auth: {
				user: configService.getEnv('SMTP_USER'),
				pass: configService.getEnv('SMTP_PASSWORD'),
			},
		};
	}

	public getRedisConfig(): RedisOptions {
		return {
			host: configService.getEnv('REDIS_HOST'),
			port: configService.getEnv('REDIS_PORT'),
			password: configService.getEnv('REDIS_PASSWORD'),
		};
	}
}

export const configService = new ConfigService();
