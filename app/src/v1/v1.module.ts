// Nest dependencies
import {
	Module
} from '@nestjs/common';

// Local files
import { AuthModule } from './Auth/auth.module';
import { UserModule } from './User/user.module';

@Module({
	imports: [
		AuthModule,
		UserModule
	],
})
export class V1Module {}
