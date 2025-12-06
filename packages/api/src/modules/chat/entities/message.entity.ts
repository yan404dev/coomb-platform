import { Message } from "@prisma/client";

export class MessageEntity {
  id!: string;
  messageType!: string;
  content!: string;
  pdf_url!: string | null;
  citations!: any;
  created_at!: Date;
  chat_id!: string;

  constructor(partial: Partial<Message>) {
    Object.assign(this, partial);
  }

  static create(data: Partial<Message>): MessageEntity {
    return new MessageEntity(data);
  }
}

