import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterModule } from '@nestjs/core';
import { BullModule } from '@nestjs/bull';

// Other dependencies
import { DataSource } from 'typeorm';
import { addTransactionalDataSource, getDataSourceByName } from 'typeorm-transactional';

// Local files
import { versionRoutes } from 'src/version.routes';
import { configService } from 'src/shared/Services/config.service';
import { V1Module } from './v1/v1.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		BullModule.forRoot({
			redis: configService.getRedisConfig(),
			limiter: {
				max: 4,
				duration: 6000,
			}
		}),
		TypeOrmModule.forRootAsync({
			useFactory: () => configService.getTypeOrmConfig(),
			dataSourceFactory: async (options) => {
				if (!options) throw new Error('Invalid options passed');
				return getDataSourceByName('default') || addTransactionalDataSource(new DataSource(options));
			  },
		}),
		RouterModule.register(versionRoutes),
		V1Module,
	]
})
export class AppModule {}
