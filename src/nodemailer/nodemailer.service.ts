import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { ConfigService } from '@nestjs/config'

export interface IMailMessage {
  to: string
  subject: string
  text?: string
  from?: string
  html?: string
}

@Injectable()
export class NodemailerService {
  private transporter: any

  constructor(private readonly configService: ConfigService) {
    let config = {}
    if (this.configService.get<string>('MAIL_SERVICE')) {
      config = {
        service: this.configService.get<string>('MAIL_SERVICE'),
      }
    } else {
      config = {
        host: this.configService.get<string>('MAIL_HOST'),
        port: this.configService.get<number>('MAIL_PORT'),
      }
    }
    this.transporter = nodemailer.createTransport({
      ...config,
      secure: false,
      requireTLS: true,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    })
  }

  public async sendMessage(message: IMailMessage) {
    message.from = this.configService.get<string>('MAIL_USER')
    await this.transporter.sendMail(message, (e, i) => {
      if (e) {
        throw new HttpException(e, HttpStatus.BAD_REQUEST)
      } else {
        console.log('Email sent: ' + i.response)
      }
    })
    this.transporter.close()
  }
}
