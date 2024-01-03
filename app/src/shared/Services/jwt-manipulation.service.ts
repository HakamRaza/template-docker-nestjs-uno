// Nest dependencies
import {
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common'

// Other dependencies
import {verify} from 'jsonwebtoken'

// Local files
import { configService } from './config.service'
import { JwtPayloadBody } from '../Types/jwt-payload-body.type';


class JwtAddonService {

    private decodeToken(jwtToken: string): any {
        if (!jwtToken) throw new UnauthorizedException('Token is missing');

        try {
            return verify(jwtToken.split(' ')[1], configService.getEnv('JWT_SECRET_FOR_ACCESS_TOKEN'))
        } catch (error) {
            throw new BadRequestException('Token signature is not valid')
        }
    }

    public getTokenProperty(jwtToken: string): JwtPayloadBody {
        return this.decodeToken(jwtToken)
    }

    public getTokenSubProperty(jwtToken: string, property: string): any {
        let decodedToken = this.decodeToken(jwtToken)
        return decodedToken[property]
    }
}

const jwtAddonService = new JwtAddonService()

export { jwtAddonService }
