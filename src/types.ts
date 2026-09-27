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

/** Options for guardCheck: "may I do this?" */
export interface GuardCheckOptions {
  /** The action about to be taken, in plain words or as the exact command or message. */
  action: string;
  /** What sort of thing it is. Default "action". */
  kind?: "command" | "action" | "message" | "other";
  /** Why, or what the person asked for. */
  context?: string;
  /** Project whose rules and intent apply. Global rules always apply. */
  project_id?: string;
}

/** The rule a guard verdict rests on. */
export interface GuardRule {
  id: number;
  source: "rule" | "intent";
  subject: string;
  content: string;
}

/** Result of guardCheck. Fails open: an error is an allow with judged=false. */
export interface GuardCheckResult {
  judged: boolean;
  decision: "allow" | "ask" | "deny";
  reason: string;
  rules_considered: number;
  kind?: string;
  rule?: GuardRule;
  matched_by?: "literal" | "judged";
  note?: string;
  model?: string;
}

/** Options for reviewWork: "did I do what was asked?" */
export interface ReviewWorkOptions {
  /** What was done: a description, the output, a message, or a transcript. */
  work: string;
  /** Intent to judge against when the project has no stored intent document. */
  intent?: string;
  /** Project whose intent document applies. */
  project_id?: string;
}

/** A contradiction between the intent and the work. */
export interface IntentViolation {
  intent: string;
  change: string;
}

/** Result of reviewWork. judged=false carries a reason (no_intent, tier, empty_work, ai_error). */
export interface ReviewWorkResult {
  judged: boolean;
  reason?: string;
  memory_id?: number;
  summary?: string;
  covered?: string[];
  uncovered?: string[];
  violations?: IntentViolation[];
  coverage?: number | null;
  proposed_update?: string;
  model?: string;
}

/** A project's intent document. */
export interface IntentDocument {
  exists: boolean;
  project_id?: string;
  content?: string;
  memory_id?: number;
  updated_at?: string;
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
