/** Memory object returned by the API. */
export interface Memory {
  id: number;
  content: string;
  memory_type: string;
  category: string;
  subject: string;
  importance: number;
  scope: string;
  project_id: string;
  custom_type: string | null;
  is_sensitive: boolean;
  times_referenced: number;
  created_at: string;
  updated_at: string;
}

/** Options for saving a memory. */
export interface SaveMemoryOptions {
  content: string;
  memory_type?: string;
  category?: string;
  subject?: string;
  importance?: number;
  scope?: string;
  project_id?: string;
}

/** Result from saving a memory. */
export interface SaveMemoryResult {
  memory_id: number;
  stored: boolean;
  deduplicated?: boolean;
  updated_existing?: number;
  conflict_detected?: boolean;
  archived_memory_id?: number;
  warning?: string;
}

/** Options for recalling memories. */
export interface RecallOptions {
  query: string;
  limit?: number;
  memory_type?: string;
  scope?: string;
}

/** Result from recalling memories. */
export interface RecallResult {
  memories: Memory[];
}

/** Options for extracting memories from conversation. */
export interface ExtractOptions {
  user_message: string;
  assistant_response?: string;
  previous_context?: string;
}

/** Result from extracting memories. */
export interface ExtractResult {
  extracted: number;
  memories: SaveMemoryResult[];
}

/** Options for loading project context. */
export interface ContextOptions {
  project_id?: string;
  include_global?: boolean;
  context?: string;
}

/** Options for listing memories. */
export interface ListOptions {
  memory_type?: string;
  category?: string;
  scope?: string;
  limit?: number;
  offset?: number;
}

/** Options for updating a memory. */
export interface UpdateMemoryOptions {
  content?: string;
  importance?: number;
  scope?: string;
}

/** Options for ingesting a document. */
export interface IngestOptions {
  text: string;
  document_type?: string;
  project_id?: string;
}

/** Result from ingesting a document. */
export interface IngestResult {
  chunks_processed: number;
  extracted: number;
  memories: SaveMemoryResult[];
}

/** Options for saving a session summary. */
export interface SessionSummaryOptions {
  summary: string;
  project_id?: string;
}

/** Export result. */
export interface ExportResult {
  version: string;
  exported_at: string;
  memory_count: number;
  memories: Memory[];
}

/** Import result. */
export interface ImportResult {
  imported: number;
  skipped: number;
  errors: number;
}

/** Memory version entry. */
export interface MemoryVersion {
  id: number;
  content: string;
  importance: number;
  scope: string;
  changed_by: string;
  created_at: string;
}

/** Usage stats. */
export interface UsageStats {
  tier: string;
  tier_name: string;
  memories_count: number;
  memories_limit: number;
  extractions_count: number;
  extractions_limit: number;
  projects_count: number;
  projects_limit: number;
}

/** Team member. */
export interface TeamMember {
  id: number;
  member_user_id: number;
  project_id: string;
  role: string;
  invited_at: string;
  accepted_at: string | null;
}

/** Memory link. */
export interface MemoryLink {
  id: number;
  memory_id: number;
  related_memory_id: number;
  relationship_type: string;
  created_at: string;
}

/** Promotion candidate. */
export interface PromotionCandidate {
  subject: string;
  memory_type: string;
  project_count: number;
  memories: Memory[];
}

/** CogmemAi client options. */
export interface CogmemAiOptions {
  /** API key (starts with cm_). */
  apiKey: string;
  /** Base URL. Defaults to hosted CogmemAi service. */
  baseUrl?: string;
  /** Request timeout in milliseconds. Defaults to 30000. */
  timeout?: number;
}
