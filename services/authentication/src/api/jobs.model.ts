import { v4 } from 'uuid';

import { BaseModel } from './base.model';

export class UserJobs extends BaseModel {
  static get AVAILABLE_FIELDS(): string[] {
    return [
      'created_at',
      'updated_at',
    ];
  }

  static get BASE_FIELDS(): string[] {
    return [
      'job_name',
      'token',
      'user_id',
    ];
  }

  static get tableName() {
    return 'user_jobs';
  }

  public id?: string;
  public job_name: string;
  public token: string;
  public user_id?: string;

  public $beforeInsert(): void {
    super.$beforeInsert();
    this.id = v4();
  }
}
