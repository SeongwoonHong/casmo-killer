import {
  AWSError,
  S3,
  config as AwsConfig,
} from 'aws-sdk';

import { configs } from '~config';

class Aws {
  private readonly bucketSettings: {
    ACL: string,
    Bucket: string,
  };
  private readonly s3Client: S3;
  private readonly endpoint: string;

  constructor() {
    const {
      AWS_ACCESS_KEY_ID: accessKeyId,
      AWS_ACL: ACL,
      AWS_BUCKET: Bucket,
      AWS_SECRET_ACCESS_KEY: secretAccessKey,
    } = configs;

    AwsConfig.update({
      accessKeyId,
      secretAccessKey,
    });

    this.endpoint = `http://${Bucket}.s3.amazonaws.com`;
    this.bucketSettings = {
      ACL,
      Bucket,
    };

    this.s3Client = new S3({
      endpoint: this.endpoint,
      s3BucketEndpoint: true,
    });
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
    return `${this.endpoint}/${key}`;
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
          ...this.bucketSettings,
          Body,
          ContentEncoding,
          ContentType,
          Key,
        },
        (err: AWSError) => {
          if (err) {
            return reject(err);
          }
          return resolve(this.buildUrl(Key));
        });
    });
  }
}

export const aws = new Aws();
