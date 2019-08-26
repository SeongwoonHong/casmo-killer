import * as uuid from 'uuid';

import { BaseModel } from './base.model';

export class CommentModel extends BaseModel {
  static get AVAILABLE_FIELDS(): string[] {
    return ['created_at', 'deleted_at', 'updated_at'];
  }

  static get BASE_FIELDS(): string[] {
    return [
      'id',
      'post_id',
      'body',
      'user_id',
      'updated_at',
      'created_at',
      'deleted_at',
    ];
  }

  static get PRIVATE_FIELDS(): string[] {
    return [];
  }

  static get tableName(): string {
    return 'comments';
  }

  public static getComments(
    post_id,
    fields: string[] = [],
  ): Promise<CommentModel[]> {
    const return_fields = Array.from(
      new Set([...CommentModel.BASE_FIELDS, ...fields]),
    );

    return CommentModel.query()
      .where({ post_id })
      .column(return_fields);
  }

  public body: string;
  public user_id: string;
  public post_id: string;
  public id: string;

  public async $beforeInsert() {
    super.$beforeInsert();
    this.id = uuid.v4();
  }
}

export class CommentNotFoundError extends Error {
  constructor(message = 'Comment not found') {
    super(message);
  }
}
