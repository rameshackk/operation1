import { getPgPool } from '../lib/db.js';

async function runMigration() {
  const pool = getPgPool();
  try {
    console.log('Running article_submissions migration...');

    // 1. Create article_submissions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS article_submissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        submitter_user_id UUID NOT NULL,
        title TEXT NOT NULL,
        category VARCHAR(100) NOT NULL DEFAULT 'personal-finance',
        display_name TEXT NOT NULL,
        summary TEXT,
        body TEXT NOT NULL,
        cover_image_url TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        reviewed_by UUID,
        reviewed_at TIMESTAMPTZ,
        review_notes TEXT,
        published_article_id UUID
      );
    `);

    // 2. Add community columns to articles
    await pool.query(`
      ALTER TABLE articles ADD COLUMN IF NOT EXISTS author_display_name TEXT;
      ALTER TABLE articles ADD COLUMN IF NOT EXISTS is_community BOOLEAN DEFAULT false;
    `);

    // 3. Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_article_sub_user ON article_submissions(submitter_user_id);
      CREATE INDEX IF NOT EXISTS idx_article_sub_status ON article_submissions(status);
      CREATE INDEX IF NOT EXISTS idx_article_sub_date ON article_submissions(submitted_at DESC);
    `);

    // 4. Set up Row Level Security
    await pool.query(`
      ALTER TABLE article_submissions ENABLE ROW LEVEL SECURITY;
    `);

    // Drop old policies if they exist, then recreate
    await pool.query(`
      DROP POLICY IF EXISTS "Users can insert own submissions" ON article_submissions;
      DROP POLICY IF EXISTS "Users view own or admin view all submissions" ON article_submissions;
      DROP POLICY IF EXISTS "Admins can update submissions" ON article_submissions;
      DROP POLICY IF EXISTS "Admins can delete submissions" ON article_submissions;

      CREATE POLICY "Users can insert own submissions"
        ON article_submissions FOR INSERT
        WITH CHECK (auth.uid() = submitter_user_id);

      CREATE POLICY "Users view own or admin view all submissions"
        ON article_submissions FOR SELECT
        USING (
          auth.uid() = submitter_user_id
          OR 
          EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
        );

      CREATE POLICY "Admins can update submissions"
        ON article_submissions FOR UPDATE
        USING (
          EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
        );

      CREATE POLICY "Admins can delete submissions"
        ON article_submissions FOR DELETE
        USING (
          EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
        );
    `);

    console.log('✅ Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

runMigration();
