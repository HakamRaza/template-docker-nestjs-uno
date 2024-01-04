import { JwtPayload } from 'jsonwebtoken';
import { JWT_SESSION_TOKEN, JWT_ROLE, JWT_USER_ID } from '../Constant';

export interface JwtPayloadBody extends JwtPayload {
	nbf: number;
	[JWT_ROLE]: number; // user role
	[JWT_USER_ID]: string; // user id
	[JWT_SESSION_TOKEN]: string; // session token uuid
}
