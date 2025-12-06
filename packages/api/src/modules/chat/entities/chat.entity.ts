import { Chat } from "@prisma/client";

export class ChatEntity {
  id!: string;
  user_id!: string | null;
  resume_id!: string | null;
  session_id!: string | null;
  title!: string;
  message_count!: number;
  last_message_at!: Date;
  created_at!: Date;
  updated_at!: Date;
  deleted_at!: Date | null;
  lastMessage?: string | null;

  constructor(partial: Partial<Chat>) {
    Object.assign(this, partial);
  }

  static create(data: Partial<Chat>): ChatEntity {
    return new ChatEntity(data);
  }
}

