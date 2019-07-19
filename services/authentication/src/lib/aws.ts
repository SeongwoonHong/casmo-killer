import {
  AWSError,
  S3,
  SES,
  config as AwsConfig,
} from 'aws-sdk';

import { EmailTemplateParams } from '~lib/types';
import { baseTemplate } from '~lib/mail';
import { configs } from '~config';

class Aws {
  private readonly s3bucketSettings: {
    ACL: string,
    Bucket: string,
  };
  private readonly s3endpoint: string;
  private readonly s3Client: S3;
  private readonly sesClient: SES;
  private readonly sesSender: string;

  constructor() {
    const {
      AWS_ACCESS_KEY_ID: accessKeyId,
      AWS_S3_ACL: ACL,
      AWS_S3_BUCKET: Bucket,
      AWS_REGION: region,
      AWS_SECRET_ACCESS_KEY: secretAccessKey,
      AWS_SES_SENDER_EMAIL: sesSender,
    } = configs;

    AwsConfig.update({
      accessKeyId,
      region,
      secretAccessKey,
    });

    this.s3endpoint = `http://${Bucket}.s3.amazonaws.com`;
    this.s3bucketSettings = {
      ACL,
      Bucket,
    };
    this.s3Client = new S3({
      endpoint: this.s3endpoint,
      s3BucketEndpoint: true,
    });

    this.sesClient = new SES();
    this.sesSender = sesSender;
  }

  public sendEmail(
    targetEmail: string | string[],
    templateData: EmailTemplateParams,
    templateGenerator = baseTemplate,
  ) {
    const Charset = 'UTF-8';
    const Data = templateGenerator(templateData);
    const ToAddresses = !Array.isArray(targetEmail)
      ? [targetEmail]
      : targetEmail;

    return this
      .sesClient
      .sendEmail({
        Destination: {
          ToAddresses,
        },
        Message: {
          Body: {
            Html: {
              Charset,
              Data,
            },
            Text: {
              Charset,
              Data: templateData.heading,
            },
          },
          Subject: {
            Charset,
            Data: templateData.heading,
          },
        },
        Source: this.sesSender,
      })
      .promise();
  }

  public uploadImage(Key: string, body: string): Promise<string> {
    const ContentEncoding = 'base64';
    const ContentType = body
      .split(';')[0]
      .replace(/^data:/, '');
    const Body = new Buffer(
      body.replace(
        /^data:image\/\w+;base64,/,
        '',
      ),
      'base64',
    );

    return this.uploadData(
      Key,
      Body,
      {
        ContentEncoding,
        ContentType,
      },
    );
  }

  private buildUrl(key: string): string {
    return `${this.s3endpoint}/${key}`;
  }

  private async uploadData(
    Key: string,
    Body: S3.Body,
    contentOptions: {
      ContentEncoding: string,
      ContentType: string,
    },
  ): Promise<string> {
    const {
      ContentEncoding = 'gzip',
      ContentType = 'text/plain',
    } = contentOptions;

    return new Promise((resolve, reject) => {
      this.s3Client.putObject(
        {
          ...this.s3bucketSettings,
          Body,
          ContentEncoding,
          ContentType,
          Key,
        },
        (err: AWSError) => {
          if (err) {
            reject(err);
          }

          resolve(this.buildUrl(Key));
        },
      );
    });
  }
}

export const aws = new Aws();
