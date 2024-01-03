// Nest dependencies
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Local files
import { jwtAddonService } from '../Services/jwt-manipulation.service';
import { JWT_ROLE, ROLES } from '../Constant';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const role = this.reflector.get<Array<number>>(
			ROLES,
			context.getHandler(),
		);

		// for route without @Role, allow all
		if (role === undefined) return true;

		// for route with @Role defined, check role payload from JWT
		const request = await context.switchToHttp().getRequest();
		const userRole: number = await jwtAddonService.getTokenSubProperty(
			request.headers.authorization,
			JWT_ROLE,
		);

		// check role from JWT is exist in @Role
		return role.includes(userRole);
	}
}
