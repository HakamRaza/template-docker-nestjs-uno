// Nest dependencies
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {NestFastifyApplication, FastifyAdapter} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Other dependencies
import fastifyCookie from '@fastify/cookie';
import fastifyMultipart from '@fastify/multipart';
import helmet from '@fastify/helmet';
import compression from '@fastify/compress';
import { FastifyRequest, FastifyReply } from 'fastify';

// Local files
import { AppModule } from './app.module';
import { configService } from './shared/Services/config.service';

async function bootstrap() {
	const fastifyAdapter = new FastifyAdapter({
		logger: configService.isProduction() ? false : true,
	});

	fastifyAdapter.enableCors({
		credentials: true,
		origin: configService.isProduction()
			? configService.getEnv('APP_DOMAIN')
			: true,
	});

	// custom information at root path '/'
	fastifyAdapter.get('/', (_req: FastifyRequest, reply: FastifyReply) => {
		reply
			.code(200)
			.header('Content-Type', 'application/json; charset=utf-8')
			.send({
				title: 'My Project',
				description: 'Restful API of myproject.com',
				contact: {
					name: 'API Support',
					email: 'support@myproject.com',
				},
				versions: ['v1'],
			});
	});

	// initialise app
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		fastifyAdapter
	);

	// middleware process of file uploads multipart
	async function onFile(part) {
		const buff = await part.toBuffer();
		const filesize = Buffer.byteLength(buff);
		const decoded = '\\x' + buff.toString('hex');
		part.value = {
			decoded,
			filesize,
			filename: part.filename,
			mimetype: part.mimetype,
		};
	}

	// Initialize security middleware module 'fastify-helmet'
	app.register(helmet, {
		contentSecurityPolicy: {
			directives: {
				defaultSrc: [`'self'`],
				styleSrc: [`'self'`, `'unsafe-inline'`],
				imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
				scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
			},
		},
	}) 
	app.register(compression); // Initialize fastify-compress to better handle high-level traffic
	app.register(fastifyCookie); // Initialize fastify-cookie for cookie manipulation
	app.register(fastifyMultipart, {
		attachFieldsToBody: 'keyValues',
		onFile,
		limits: {
			fileSize: 10000000, // For multipart forms, the max file size in bytes, 10 MB
			files: 3, 			   // Max number of file fields
			// fieldNameSize: 100, // Max field name size in bytes
			// fieldSize: 100,     // Max field value size in bytes
			// fields: 10,         // Max number of non-file fields
			// headerPairs: 2000,  // Max number of header key=>value pairs
		},
	}); // Enable multipart data support

	app.setGlobalPrefix('/api'); // Setting base path for api route
	app.useGlobalPipes(new ValidationPipe()); // Initialize global validation, https://docs.nestjs.com/pipes#class-validator

	if (!configService.isProduction()) {
		const options = new DocumentBuilder()
			.setTitle('My Project API Documentation')
			.setVersion('1.0')
			.addBearerAuth()
			.build();
		const document = SwaggerModule.createDocument(app, options);
		SwaggerModule.setup('/' + configService.getEnv('SWAGGER_ACCESS_PATH'), app, document); // setup swagger docs and path
	} else {
		// production setup, example setting sentry
	}

	app.listen(
		Number(configService.getEnv('APP_PORT')) +
		Number(configService.getEnv('INSTANCE_ID') || 0),
		'0.0.0.0'
	);
}

bootstrap();
