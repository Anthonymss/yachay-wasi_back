import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import { join } from 'path';
import { mailConfig } from './mail.config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: mailConfig.secure,
      auth: mailConfig.auth,
    });
    const isProd = process.env.NODE_ENV === 'production';
    const templatesPath = isProd
      ? join(process.cwd(), 'dist', 'shared', 'mail', 'templates')
      : join(process.cwd(), 'src', 'shared', 'mail', 'templates');

    // ✅ Configurar handlebars como plugin
    this.transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extname: '.hbs',
          partialsDir: templatesPath,
          layoutsDir: templatesPath,
          defaultLayout: false,
        },
        viewPath: templatesPath,
        extName: '.hbs',
      }),
    );
  }

  async sendTemplate(
    to: string,
    templateName: string,
    subjectData: { subject?: string },
    context: any,
  ): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: mailConfig.from,
        to,
        subject: subjectData.subject || 'Notificación',
        template: templateName,
        context,
      });

      this.logger.log(`Correo enviado a ${to}: ${info.messageId}`);
    } catch (err) {
      this.logger.error(`Error al enviar correo a ${to}:`, err);
      throw err;
    }
  }
}
