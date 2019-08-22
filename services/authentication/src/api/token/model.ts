import { v4 } from 'uuid';

import { BaseModel } from '../base.model';
import { UserModel } from '../user.model';

export class TokenModel extends BaseModel {
  static get AVAILABLE_FIELDS(): string[] {
    return [
      'created_at',
      'updated_at',
      'user_agent',
    ];
  }

  static get BASE_FIELDS(): string[] {
    return [
      'refresh_token',
      'user_id',
    ];
  }

  static get tableName() {
    return 'refresh_tokens';
  }

  public id: string;
  public user_agent?: string;
  public user_id: string;
  public refresh_token: string;

  public $beforeInsert(): void {
    super.$beforeInsert();
    this.id = v4();
  }

  public async refreshUserToken(
    user: UserModel,
    user_agent: string = null,
  ) {
    const {
      access_token,
      refresh_token,
    } = await user.generateTokens();

    await this
      .$query<TokenModel>()
      .patchAndFetch({
        refresh_token,
        user_agent,
      });

    return {
      access_token,
      refresh_token,
    };
  }
}
