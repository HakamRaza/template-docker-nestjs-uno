// Nest dependencies
import {
    BadRequestException,
    Controller,
    UseGuards,
    Get,
    Post,
    Patch,
    Put,
    Param,
    Body,
    Headers,
    Query,
    Res,
    Req,
    Delete,
    StreamableFile,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

// Other dependencies
import { FastifyReply } from 'fastify';

// Local files
import { UserService } from '../Service/user.service'
import { UpdateUserDto } from '../Dto/update-user.dto'
import { ActivateUserDto } from '../Dto/activate-user.dto'
import { ISerializeResponse, serializerService } from 'src/shared/Services/serializer.service'
import { Roles } from 'src/shared/Decorators/roles.decorator'
import { UserBanDto } from '../Dto/user-ban.dto'
import { JwtAuthGuard } from 'src/shared/Guards/jwt-auth.guard'
import { SingleUUIDDto } from 'src/v1/Auth/Dto/single-uuid.dto'
import { RolesEnum } from 'src/shared/Enums/roles.enums'
import { PageOptionsDto } from 'src/shared/Dto/page-options.dto'
import { StatusOk } from 'src/shared/Types/http.type';

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
        let user = await this.userService.getOwnProfile(bearer);
        return serializerService.serializeResponse('user_profile', user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('/own-profile')
    async updateOwnProfile(
        @Headers('authorization') bearer: string,
        @Body() dto: UpdateProfileDto
    ): Promise<ISerializeResponse> {
        let user = await this.userService.updateOwnProfile(bearer);
        return serializerService.serializeResponse('user_profile', user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(RolesEnum.admin) // only admin role access
    @Get('/:uuid/profile')
    async getOtherProfile(
        @Param() param: SingleUUIDDto,
    ): Promise<ISerializeResponse> {
        let user = await this.userService.getProfile(param.uuid);
        return serializerService.serializeResponse('user_profile', user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(RolesEnum.staff) // staff & admin role access
    @Get('/:uuid/profile/image')
    async getOtherProfile(
        @Param() param: SingleUUIDDto,
        @Res({ passthrough: true }) res: FastifyReply
    ): Promise<StreamableFile> {
        const buffer = await this.userService.donwloadProfileImage(bearer);

        res.headers({
            'Content-Length': Buffer.byteLength(buffer),
            'Content-Disposition': 'attachment;filename=profile_image.png',
        });

        return new StreamableFile(buffer);
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
    @Delete('/notes/:uuid')
    async addNote(
        @Param() param: SingleUUIDDto,
    ): Promise<StatusOk> {
        await this.userService.removeNote(param.uuid);
        return { status: 'ok', message: 'Note has been deleted' };
    }
}
