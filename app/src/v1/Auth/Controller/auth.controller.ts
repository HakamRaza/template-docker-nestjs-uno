// Nest dependencies
import {
    Controller,
    Body,
    Get,
    Post,
    Headers,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

// Other dependencies

// Local files
import { StatusOk } from 'src/shared/Types/http.type';
import { LoginDto } from '../Dto/login.dto';
import { JwtAuthGuard } from 'src/shared/Guards/jwt-auth.guard';
import { ISerializeResponse, serializerService } from 'src/shared/Services/serializer.service';
import { AuthService } from '../Service/auth.service';
import { RegisterDto } from '../Dto/register.dto';


@ApiTags('v1/auth')
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    async signup(
        @Body() dto: RegisterDto
    ): Promise<StatusOk> {
        await this.authService.signup(dto)
        return { status: 'ok', message: 'Welcome!, please start login.' };
    }

    @Post('login')
    async login(
        @Body() dto: LoginDto
    ): Promise<ISerializeResponse> {
        const [user, access_token] = await this.authService.login(dto)
        return serializerService.serializeResponse('login_detail', { access_token, user }, user.id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('logout')
    async logout(
        @Headers('authorization') bearer: string
    ): Promise<StatusOk> {
        await this.authService.logout(bearer);
        return { status: 'ok', message: 'Sessions invalidated.' };
    }
}
