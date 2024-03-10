import nodemailer, { Transporter } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { EmailParams } from './types'
import { logMessage } from './config'

export class MailService {
  private static instance: MailService | undefined = undefined
  private static subject: string = 'Token distribution'
  private transporter: Transporter<SMTPTransport.SentMessageInfo>
  private params: EmailParams

  private constructor(params: EmailParams) {
    // Create a transporter using your Gmail account and password generated at
    // https://myaccount.google.com/u/2/apppasswords
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: params.from,
        pass: params.password,
      },
    })

    this.transporter = transporter
    this.params = params
  }

  public static getInstance(params: EmailParams): MailService {
    if (!this.instance) {
      this.instance = new MailService(params)
    }
    this.instance.params = params
    return this.instance
  }

  public async sendEmail(textMessage: string) {
    // Define the email options
    const mailOptions = {
      from: this.params.from,
      to: this.params.to,
      subject: MailService.subject,
      text: textMessage,
    }

    // Send the email
    await this.transporter.sendMail(mailOptions)
  }
}
