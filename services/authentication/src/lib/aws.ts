import {
  AWSError,
  S3,
  config as AwsConfig,
} from 'aws-sdk';

import { configs } from '~config';
import { getBase64 } from '~lib/./img-utils';

class Aws {
  private readonly s3bucketSettings: {
    ACL: string,
    Bucket: string,
  };
  private readonly s3endpoint: string;
  private readonly s3Client: S3;

  constructor() {
    const {
      AWS_ACCESS_KEY_ID: accessKeyId,
      AWS_S3_ACL: ACL,
      AWS_S3_BUCKET: Bucket,
      AWS_REGION: region,
      AWS_SECRET_ACCESS_KEY: secretAccessKey,
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
  }

  public uploadImageData(
    Key: string,
    body: string,
  ): Promise<string> {
    const ContentEncoding = 'base64';
    const ContentType = body
      .split(';')[0]
      .replace(/^data:/, '');
    const Body = Buffer.from(
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

  public async uploadImageFromUrl(
    Key: string,
    uri: string,
  ): Promise<string> {
    const body = await getBase64(uri);

    return this.uploadImageData(
      Key,
      body,
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
