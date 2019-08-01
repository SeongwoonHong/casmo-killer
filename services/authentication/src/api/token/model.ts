import { BaseModel } from '../base.model';
import { UserModel } from '../user.model';

export class TokenModel extends BaseModel {
  static get idColumn() {
    return 'user_id';
  }

  static get tableName() {
    return 'refresh_tokens';
  }

  public user_id: string;
  public refresh_token: string;

  public async refreshToken() {
    const refresh_token = await UserModel.generateRefreshToken(this.user_id);

    return this
      .$query<TokenModel>()
      .patchAndFetch({
        refresh_token,
      });
  }
}
