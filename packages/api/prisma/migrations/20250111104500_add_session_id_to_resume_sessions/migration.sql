DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'resume_sessions') THEN
        ALTER TABLE "resume_sessions" ADD COLUMN IF NOT EXISTS "session_id" UUID;
        CREATE UNIQUE INDEX IF NOT EXISTS "resume_sessions_session_id_key" ON "resume_sessions"("session_id") WHERE "session_id" IS NOT NULL;
        CREATE INDEX IF NOT EXISTS "resume_sessions_session_id_idx" ON "resume_sessions"("session_id");
        ALTER TABLE "resume_sessions" ALTER COLUMN "user_id" DROP NOT NULL;
        ALTER TABLE "resume_sessions" ALTER COLUMN "resume_id" DROP NOT NULL;
    END IF;
END $$;



