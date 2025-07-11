import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { join } from 'path';
import { mailConfig } from './mail.config';
import hbs from 'nodemailer-express-handlebars';
import { create } from 'express-handlebars';

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

    const hbsOptions = {
      viewEngine: create({
        extname: '.hbs',
        layoutsDir: templatesPath,
        partialsDir: templatesPath,
        defaultLayout: false,
      }),
      viewPath: templatesPath,
      extName: '.hbs',
    };

    this.transporter.use('compile', hbs(hbsOptions));
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
      } as any);

      this.logger.log(`Correo enviado a ${to} con ID: ${info.messageId}`);
    } catch (err) {
      this.logger.error(`Error al enviar correo a ${to}:`, err);
      throw new BadRequestException('Error al enviar correo');
    }
  }
}
