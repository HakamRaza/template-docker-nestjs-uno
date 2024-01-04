export interface EmailSenderBody {
	from?: string;
	to: string | string[];
	cc?: string | string[];
	bcc?: string | string[];
}

export interface EmailFullBody extends EmailSenderBody {
	subject: string;
	text?: string;
	html: string;
}

export interface WelcomeEmailBody extends EmailSenderBody {
	to: string;
	websiteUrl: string
}
