// Nest dependencies
import { Injectable } from '@nestjs/common';

// Other dependencies
import * as nodemailer from 'nodemailer';

// Local files
import { configService } from './config.service';
import WelcomeTemplate from '../Template/Email/welcome.template';
import { EmailFullBody, WelcomeEmailBody } from '../Dto/mail.type';

@Injectable()
export class MailService {
	private static instance: MailService;

	static getInstance() {
		if (!MailService.instance) {
			MailService.instance = new MailService();
		}
		return MailService.instance;
	}

	private sendEmail(bodyData: EmailFullBody): Promise<void> {
		return new Promise(async (resolve, reject) => {
			const transporter = nodemailer.createTransport(
				configService.getMailConfig()
			);

			transporter.sendMail(bodyData, (error) => {
				if (error) reject(error);
				resolve();
			});
		});
	}

	public sendWelcomeMail(userEmail: string, ): Promise<void> {
		const domain = configService.getEnv('APP_DOMAIN');

		const body: WelcomeEmailBody = {
			from: 'noreply@' + domain,
			to: userEmail,
			websiteUrl: 'http://' + domain + '/login'
		}

		const template = WelcomeTemplate(body);
		const mailOptions: EmailFullBody = {
			...body,
			subject: 'Welcome New User!',
			text: template.text,
			html: template.html,
		};

		return this.sendEmail(mailOptions);
	}
}
