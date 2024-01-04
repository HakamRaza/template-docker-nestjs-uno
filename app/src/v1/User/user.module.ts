// Nest dependencies
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Local files
import { UserRepository } from 'src/shared/Repositories/user.repository';
import { UserService } from './Service/user.service';
import { UsersController } from './Controller/user.controller';
import { RolesGuard } from 'src/shared/Guards/roles.guard';
import { NoteRepository } from 'src/shared/Repositories/note.repository';
import { ProfileRepository } from 'src/shared/Repositories/profile.repository';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			UserRepository,
			NoteRepository,
			ProfileRepository,
		]),
	],
	controllers: [UsersController],
	providers: [
		UserService,
		UserRepository,
		NoteRepository,
		ProfileRepository,
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
	],
	exports: [UserService],
})
export class UserModule {}
