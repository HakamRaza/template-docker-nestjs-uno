import { WelcomeEmailBody } from "src/shared/Dto/mail.type";

const WelcomeTemplate = (dto: WelcomeEmailBody) => {
    const html = `
    <!DOCTYPE html>
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
            <meta charset="utf-8">
            <meta name="x-apple-disable-message-reformatting">
            <meta http-equiv="x-ua-compatible" content="ie=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
            <title>Welcome ${dto.username}</title>
        </head>

        <body>
            <p>
                Hi <b>${dto.username}</b>,
            </p>
            <p>
                <b>Welcome!</b>
            </p>
            <p>
                We are here to help. Login now at the <a href="${dto.websiteUrl}">website</a>.
            </p>
            <p>
                Thank you.
            </p>
            <p>
                Best Regard,<br>
            </p>
        <body/>
    </html>`;

    const text = `
        Hi ${dto.username}, 
        
        Welcome.
        Login now at: "${dto.websiteUrl}"
    `;

    return {
        html: html,
        text: text,
    };
};

export default WelcomeTemplate;
