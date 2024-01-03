// Nest dependencies
import { Injectable, BadRequestException } from '@nestjs/common'

// Other dependencies
import * as jwt from 'jsonwebtoken'
import { createReadStream } from 'fs'

// Local files

import { UpdateUserDto } from '../Dto/update-user.dto'
import { serializerService, ISerializeResponse } from 'src/shared/Services/serializer.service'
import { ActivateUserDto } from '../Dto/activate-user.dto'
import { configService } from 'src/shared/Services/config.service'
import { UserRepository } from 'src/shared/Repositories/user.repository'
import { NoteRepository } from 'src/shared/Repositories/note.repository'
import { UserEntity } from 'src/shared/Entities/user.entity'
import { jwtAddonService } from 'src/shared/Services/jwt-manipulation.service'
import { JWT_USER_ID } from 'src/shared/Constant'
import { ProfileRepository } from 'src/shared/Repositories/profile.repository'


@Injectable()
export class UserService {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly noteRepository: NoteRepository,
        private readonly profileRepository: ProfileRepository,
    ) {}

    //------------------------------ Profile ----------------------------------
    
    async getProfile(userId:string): Promise<UserEntity> {
        return this.profileRepository.findByUserId(userId);
    }

    async getOwnProfile(bearer:string): Promise<UserEntity> {
        const userId = await jwtAddonService.getTokenSubProperty(bearer, JWT_USER_ID);
        return this.getProfile(userId);
    }

    
    //------------------------------ Notes ----------------------------------


}
