import { BaseModel } from '../base.model';
import { UserModel } from '../user.model';

export class TokenModel extends BaseModel {
  static get AVAILABLE_FIELDS(): string[] {
    return [
      'created_at',
      'updated_at',
    ];
  }

  static get BASE_FIELDS(): string[] {
    return [
      'refresh_token',
      'user_id',
    ];
  }

  static get idColumn() {
    return 'user_id';
  }

  static get tableName() {
    return 'refresh_tokens';
  }

  public user_id: string;
  public refresh_token: string;

  public async refreshToken(user: UserModel) {
    const {
      access_token,
      refresh_token,
    } = await user.generateTokens();

    await this
      .$query<TokenModel>()
      .patchAndFetch({
        refresh_token,
      });

    return {
      access_token,
      refresh_token,
    };
  }
}
