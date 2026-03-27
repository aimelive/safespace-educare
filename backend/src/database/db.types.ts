import { Generated } from 'kysely';

interface ChatSessionsTable {
  id: Generated<string>;
  student_id: string;
  counselor_id: string | null;
  is_anonymous: boolean;
  status: string;
  created_at: Date;
}

interface ChatMessagesTable {
  id: Generated<string>;
  chat_id: string;
  sender_id: string;
  message: string;
  created_at: Date;
}

interface UsersTable {
  id: Generated<string>;
  email: string;
  password: string;
  name: string;
  age: number | null;
  role: 'student' | 'counselor' | 'admin';
  school: string | null;
  specialization: string | null;
  available_hours: string | null;
  created_at: Date;
}

interface SessionsTable {
  id: Generated<string>;
  student_id: string;
  counselor_id: string;
  scheduled_date: string;
  scheduled_time: string;
  topic: string;
  status: string;
  notes: string | null;
  created_at: Date;
  updated_at: Date | null;
}

interface ResourcesTable {
  id: Generated<string>;
  title: string;
  description: string | null;
  url: string | null;
  category: string | null;
  type: string | null;
  is_active: boolean;
  created_at: Date;
}

interface SavedResourcesTable {
  user_id: string;
  resource_id: string;
  saved_at: Date;
}

export interface DatabaseSchema {
  users: UsersTable;
  sessions: SessionsTable;
  resources: ResourcesTable;
  saved_resources: SavedResourcesTable;
  chat_sessions: ChatSessionsTable;
  chat_messages: ChatMessagesTable;
}
