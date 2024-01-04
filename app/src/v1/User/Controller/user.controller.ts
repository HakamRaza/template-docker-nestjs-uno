// Nest dependencies
import {
    BadRequestException,
    Controller,
    UseGuards,
    Get,
    Post,
    Param,
    Body,
    Headers,
    Query,
    Res,
    Delete,
    StreamableFile,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

// Other dependencies
import { FastifyReply } from 'fastify';

// Local files
import { UserService } from '../Service/user.service'
import { ISerializeResponse, serializerService } from 'src/shared/Services/serializer.service'
import { Roles } from 'src/shared/Decorators/roles.decorator'
import { JwtAuthGuard } from 'src/shared/Guards/jwt-auth.guard'
import { SingleIDDto } from 'src/v1/Auth/Dto/single-id.dto'
import { RolesEnum } from 'src/shared/Enums/roles.enums'
import { PageOptionsDto } from 'src/shared/Dto/page-options.dto'
import { StatusOk } from 'src/shared/Types/http.type';
import { UpdateProfileDto } from '../Dto/update-profile.dto';
import { AddNoteDto } from '../Dto/add-note.dto';

@ApiTags('v1/user')
@Controller()
export class UsersController {
    constructor(private readonly userService: UserService) {}

    //------------------------------ Profile ----------------------------------

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('/own-profile')
    async getOwnProfile(
        @Headers('authorization') bearer: string,
    ): Promise<ISerializeResponse> {
        let profile = await this.userService.getOwnProfile(bearer);
        return serializerService.serializeResponse('user_profile', profile, profile.user_id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('/own-profile')
    async updateOwnProfile(
        @Headers('authorization') bearer: string,
        @Body() dto: UpdateProfileDto
    ): Promise<ISerializeResponse> {
        let profile = await this.userService.updateOrCreateOwnProfile(bearer, dto);
        return serializerService.serializeResponse('user_profile', profile, profile.user_id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(RolesEnum.admin) // only admin role access
    @Get('/:id/profile')
    async getOtherProfile(
        @Param() param: SingleIDDto,
    ): Promise<ISerializeResponse> {
        let profile = await this.userService.getProfile(param.id);
        return serializerService.serializeResponse('user_profile', profile, profile.user_id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) // open to anyone who auth'ed
    @Get('/:id/profile/image')
    async downloadProfileImage(
        @Param() param: SingleIDDto,
        @Res({ passthrough: true }) res: FastifyReply
    ): Promise<StreamableFile|StatusOk> {
        const profile = await this.userService.getProfile(param.id);

        if(profile.image_size <= 0) return { status: 'failed', message: 'No image found' };
        
        res.headers({
            'Content-Length': profile.image_size,
            'Content-Disposition': 'attachment;filename=' + profile.image_name,
        });

        return new StreamableFile(profile.image_buffer);
    }
    
    //------------------------------ Notes ----------------------------------

    // open route
    @Get('/notes')
    async getNoteList(
        @Query() query: PageOptionsDto
    ): Promise<ISerializeResponse> {
        const [data, itemCount] = await this.userService.getNoteList(query);
		return serializerService.paginateResponse('note_list', data, query, itemCount);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(RolesEnum.staff) // staff & admin role access
    @Post('/notes')
    async addNote(
        @Headers('authorization') bearer: string,
        @Body() dto: AddNoteDto
    ): Promise<ISerializeResponse> {
        let note = await this.userService.addNote(bearer, dto);
        return serializerService.serializeResponse('note', note, note.id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(RolesEnum.admin) // only admin can delete notes
    @Delete('/notes/:id')
    async removeNote(
        @Param() param: SingleIDDto,
    ): Promise<StatusOk> {
        await this.userService.removeNote(param.id);
        return { status: 'ok', message: 'Note has been deleted' };
    }
}
