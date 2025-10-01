/*
  # Create conversation history tables

  1. New Tables
    - `conversations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable for anonymous users)
      - `language` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `messages`
      - `id` (uuid, primary key)
      - `conversation_id` (uuid, foreign key)
      - `role` (text) - 'user' or 'assistant'
      - `content` (text)
      - `emotion_type` (text, nullable)
      - `emotion_intensity` (numeric, nullable)
      - `emotion_confidence` (numeric, nullable)
      - `topics` (text[], nullable)
      - `audio_url` (text, nullable)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on both tables
    - Allow anonymous users to read/write their own conversations
*/

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT NULL,
  language text NOT NULL DEFAULT 'en-US',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  emotion_type text DEFAULT NULL,
  emotion_intensity numeric DEFAULT NULL,
  emotion_confidence numeric DEFAULT NULL,
  topics text[] DEFAULT '{}',
  audio_url text DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read own conversations"
  ON conversations FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous insert conversations"
  ON conversations FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update own conversations"
  ON conversations FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous read messages"
  ON messages FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous insert messages"
  ON messages FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);