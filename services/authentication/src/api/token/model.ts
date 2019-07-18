import { BaseModel } from '../base.model';

export class TokenModel extends BaseModel {
  static get tableName() {
    return 'refresh_tokens';
  }
}
