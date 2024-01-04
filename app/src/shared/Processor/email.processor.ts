// Nest dependencies
import { Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';

// Other dependencies
import { Job } from 'bull';

// Local files
import { MailService } from '../Services/mail.service';

@Processor('email-queue')
export class EmailProcessor {
	private readonly mailService = new MailService();

	@Process('sendWelcomeMail')
	async handleSendWelcome(job: Job) {
		// send welcome mail
		await this.mailService.sendWelcomeMail(job.data.to).catch((_err) => {
			console.error(_err);
		});
	}
}
