import * as uuid from 'uuid';

import { BaseModel } from './base.model';

export class PostModel extends BaseModel {
  static get AVAILABLE_FIELDS(): string[] {
    return ['created_at', 'deleted_at', 'updated_at'];
  }

  static get BASE_FIELDS(): string[] {
    return ['id', 'title', 'body', 'user_id', 'thumnail', 'created_at'];
  }

  static get PRIVATE_FIELDS(): string[] {
    return [];
  }

  static get tableName(): string {
    return 'posts';
  }

  public static getPosts(fields: string[] = []): Promise<PostModel[]> {
    const return_fields = Array.from(
      new Set([...PostModel.BASE_FIELDS, ...fields]),
    );

    return PostModel.query().column(return_fields);
  }

  public thumnail?: string;
  public user_id: string;
  public title: string;
  public id: string;
  public body: string;

  public async $beforeInsert() {
    super.$beforeInsert();
    this.id = uuid.v4();
  }
}

export class PostNotFoundError extends Error {
  constructor(message = 'Post not found') {
    super(message);
  }
}
