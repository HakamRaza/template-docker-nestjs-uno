// Nest dependencies
import { Routes } from '@nestjs/core';

// Local files
import { V1Module } from './v1/v1.module';
import { AuthModule } from './v1/Auth/auth.module';
import { UserModule } from './v1/User/user.module';

/**
 * Reference: https://docs.nestjs.com/recipes/router-module
 */
export const versionRoutes: Routes = [
	{
		path: '/v1',
		module: V1Module,
		children: [
			{
				path: '/auth',
				module: AuthModule,
			},
			{
				path: '/user',
				module: UserModule,
			}
		],
	},
];
