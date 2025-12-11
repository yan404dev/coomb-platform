CREATE TABLE IF NOT EXISTS "chat_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL UNIQUE,
    "user_id" UUID,
    "chat_id" UUID,
    "resume_data" JSONB,
    "original_resume_data" JSONB,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resumeId" UUID,

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "chat_sessions_session_id_key" ON "chat_sessions"("session_id");
CREATE INDEX IF NOT EXISTS "chat_sessions_session_id_idx" ON "chat_sessions"("session_id");
CREATE INDEX IF NOT EXISTS "chat_sessions_user_id_idx" ON "chat_sessions"("user_id");
CREATE INDEX IF NOT EXISTS "chat_sessions_chat_id_idx" ON "chat_sessions"("chat_id");
CREATE INDEX IF NOT EXISTS "chat_sessions_expires_at_idx" ON "chat_sessions"("expires_at");

-- Foreign keys serão criadas depois quando as tabelas existirem
-- ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "resume_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resume"("id") ON DELETE SET NULL ON UPDATE CASCADE;

