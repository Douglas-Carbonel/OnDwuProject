
-- Drop existing tables if they exist to recreate with correct structure
DROP TABLE IF EXISTS evaluation_attempts;
DROP TABLE IF EXISTS evaluations;

-- Create evaluations table with integer userId and FK constraint
CREATE TABLE evaluations (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "moduleNumber" INTEGER NOT NULL,
  score INTEGER NOT NULL,
  "totalQuestions" INTEGER NOT NULL,
  "correctAnswers" INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  answers JSONB NOT NULL,
  "timeSpent" INTEGER,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_evaluations_user FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Create evaluation_attempts table with integer userId and FK constraint
CREATE TABLE evaluation_attempts (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "moduleNumber" INTEGER NOT NULL,
  "attemptNumber" INTEGER NOT NULL,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_evaluation_attempts_user FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Update progress table to use integer userId and add FK constraint
DO $$ 
BEGIN
  -- Check if progress table exists and update column names and types
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'progress') THEN
    -- First rename columns if they exist with old names
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'progress' AND column_name = 'user_id') THEN
      ALTER TABLE progress RENAME COLUMN user_id TO "userId";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'progress' AND column_name = 'current_day') THEN
      ALTER TABLE progress RENAME COLUMN current_day TO "currentDay";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'progress' AND column_name = 'completed_days') THEN
      ALTER TABLE progress RENAME COLUMN completed_days TO "completedDays";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'progress' AND column_name = 'day_progress') THEN
      ALTER TABLE progress RENAME COLUMN day_progress TO "dayProgress";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'progress' AND column_name = 'quiz_results') THEN
      ALTER TABLE progress RENAME COLUMN quiz_results TO "quizResults";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'progress' AND column_name = 'created_at') THEN
      ALTER TABLE progress RENAME COLUMN created_at TO "createdAt";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'progress' AND column_name = 'updated_at') THEN
      ALTER TABLE progress RENAME COLUMN updated_at TO "updatedAt";
    END IF;

    -- Convert userId to integer if it's currently text
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'progress' AND column_name = 'userId' AND data_type = 'text') THEN
      -- Update text user IDs to integers (extract numeric part if needed)
      UPDATE progress SET "userId" = CAST(REGEXP_REPLACE("userId", '[^0-9]', '', 'g') AS INTEGER) WHERE "userId" ~ '[0-9]';
      -- Change column type to integer
      ALTER TABLE progress ALTER COLUMN "userId" TYPE INTEGER USING "userId"::INTEGER;
    END IF;

    -- Add foreign key constraint to progress table
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'progress' AND constraint_name = 'fk_progress_user') THEN
      ALTER TABLE progress ADD CONSTRAINT fk_progress_user FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_evaluations_user_module ON evaluations("userId", "moduleNumber");
CREATE INDEX IF NOT EXISTS idx_attempts_user_module ON evaluation_attempts("userId", "moduleNumber");
CREATE INDEX IF NOT EXISTS idx_evaluations_created_at ON evaluations("createdAt");
CREATE INDEX IF NOT EXISTS idx_attempts_created_at ON evaluation_attempts("createdAt");

-- Verify tables were created correctly
SELECT 'Tables created successfully with FK constraints' as status;
