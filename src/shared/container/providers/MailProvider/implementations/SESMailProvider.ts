import SES from 'aws-sdk/clients/ses';
import { inject, injectable } from 'tsyringe';

import mailConfig from '@config/mail';

import { IMailTemplateProvider } from '../../MailTemplateProvider/models/IMailTemplateProvider';
import { ISendMailDTO } from '../dtos/ISendMailDTO';
import { IMailProvider } from '../models/IMailProvider';

@injectable()
export class SESMailProvider implements IMailProvider {
  private client: SES;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    this.client = new SES({
      region: 'us-east-2',
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from;

    // await this.client
    //   .getSendQuota()
    //   .promise()
    //   .then(console.log)
    //   .catch(console.log);
    await this.client
      .sendEmail({
        Source: `${from?.name || name} <${from?.email || email}>`,
        Destination: {
          CcAddresses: [`${to.name} <${to.email}>`],
        },
        Message: {
          Subject: {
            Data: subject,
          },
          Body: {
            Html: {
              Data: await this.mailTemplateProvider.parse(templateData),
            },
            Text: {
              Data: await this.mailTemplateProvider.parse(templateData),
            },
          },
        },
      })
      .promise();
  }
}
