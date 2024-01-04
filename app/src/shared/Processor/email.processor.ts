// Nest dependencies
import { Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';

// Other dependencies
import { Job } from 'bull';

// Local files
import { MailService } from '../Services/mail.service';

@Processor('emailQueue')
export class EmailProcessor {
	constructor(
		private readonly mailService: MailService,
	) {}
	
	private readonly logger = new Logger(EmailProcessor.name)

	// send welcome mail
	@Process('welcome')
	async handleSendWelcome(job: Job) {
		const { data } = job;
		this.logger.debug('Email sent');

		await this.mailService.sendWelcomeMail(data.to).catch((_err) => {
			console.error(_err);
			this.logger.debug('Error sent email');
		});
	}
}
