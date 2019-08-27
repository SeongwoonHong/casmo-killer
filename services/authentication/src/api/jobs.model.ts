import { v4 } from 'uuid';

import { BaseModel } from './base.model';
import { constants } from '~constants';
import { generateRandomStr } from '~lib/miscel';

const {
  JOB_NAME_FOR_EMAIL_UPDATE,
  JOB_NAME_FOR_REGISTRATION,
} = constants;

export class UserJobs extends BaseModel {
  public static get AVAILABLE_FIELDS(): string[] {
    return [
      'created_at',
      'updated_at',
    ];
  }

  public static get BASE_FIELDS(): string[] {
    return [
      'job_name',
      'token',
      'user_id',
    ];
  }

  public static get tableName() {
    return 'user_jobs';
  }

  public static async generateJobToken(): Promise<string> {
    let code;
    let isTaken = true;

    while (isTaken) {
      code = generateRandomStr();

      ({ isTaken } = await UserJobs.isValueTaken({
        field: 'token',
        value: code,
      }));
    }

    return code;
  }

  public static completeRegistrationJob(
    email: string,
  ) {
    return UserJobs
      .query()
      .delete()
      .where({
        job_name: constants.JOB_NAME_FOR_REGISTRATION,
        user_id: email,
      });
  }

  public static completeEmailUpdate(
    user_id: string,
  ) {
    return UserJobs
      .query()
      .delete()
      .where({
        job_name: constants.JOB_NAME_FOR_EMAIL_UPDATE,
        user_id,
      });
  }

  public static findUserForRegistration(
    token: string,
    email: string,
  ): Promise<UserJobs> {
    return UserJobs
      .query()
      .findOne({
        job_name: JOB_NAME_FOR_REGISTRATION,
        token,
        user_id: email,
      });
  }

  public static findUserForEmailUpdate(
    token: string,
    user_id: string,
  ): Promise<UserJobs> {
    return UserJobs
      .query()
      .findOne({
        job_name: JOB_NAME_FOR_EMAIL_UPDATE,
        token,
        user_id,
      });
  }

  public static registerRegisterConfirm(
    email: string,
    token: string,
  ): Promise<UserJobs> {
    return UserJobs
      .query()
      .insert({
        job_name: JOB_NAME_FOR_REGISTRATION,
        token,
        user_id: email,
      });
  }

  public static registerEmailUpdate(
    email: string,
    token: string,
  ): Promise<UserJobs> {
    return UserJobs
      .query()
      .insert({
        job_name: JOB_NAME_FOR_EMAIL_UPDATE,
        token,
        user_id: email,
      });
  }

  public id?: string;
  public expires_at: string;
  public job_name: string;
  public token: string;
  public user_id?: string;

  public $beforeInsert(): void {
    super.$beforeInsert();
    this.id = v4();
    this.expires_at = this.getExpiryTimestamp();
  }

  public $beforeUpdate(): void {
    super.$beforeUpdate();
    this.expires_at = this.getExpiryTimestamp();
  }

  private getExpiryTimestamp(): string {
    return new Date(Date.now() + 60 * 60 * 24 * 1000).toISOString();
  }
}
