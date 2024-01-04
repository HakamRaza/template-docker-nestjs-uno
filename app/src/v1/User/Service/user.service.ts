// Nest dependencies
import { 
    Injectable,
    BadRequestException
} from '@nestjs/common'

// Other dependencies
import * as jwt from 'jsonwebtoken'
import { createReadStream } from 'fs'

// Local files
import { configService } from 'src/shared/Services/config.service'
import { UserRepository } from 'src/shared/Repositories/user.repository'
import { NoteRepository } from 'src/shared/Repositories/note.repository'
import { UserEntity } from 'src/shared/Entities/user.entity'
import { jwtAddonService } from 'src/shared/Services/jwt-manipulation.service'
import { JWT_USER_ID } from 'src/shared/Constant'
import { ProfileRepository } from 'src/shared/Repositories/profile.repository'
import { UpdateProfileDto } from '../Dto/update-profile.dto'
import { ProfileEntity } from 'src/shared/Entities/profile.entity'


@Injectable()
export class UserService {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly noteRepository: NoteRepository,
        private readonly profileRepository: ProfileRepository,
    ) {}

    //------------------------------ Profile ----------------------------------
    
    async getProfile(userId:number): Promise<ProfileEntity> {
        return this.profileRepository.findByUserId(userId);
    }

    async getOwnProfile(bearer:string): Promise<ProfileEntity> {
        // extract user_id from 'sub' token
        const userId = await jwtAddonService.getTokenSubProperty(bearer, JWT_USER_ID);

        return this.getProfile(userId);
    }

    async updateOrCreateOwnProfile(bearer: string, dto: UpdateProfileDto): Promise<ProfileEntity> {
        // extract user_id from 'sub' token
        const userId = await jwtAddonService.getTokenSubProperty(bearer, JWT_USER_ID);

        return this.profileRepository.addOrCreateNew(userId, dto);
    }

    
    
    //------------------------------ Notes ----------------------------------


}
