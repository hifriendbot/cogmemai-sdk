import type {
  CogmemAiOptions,
  SaveMemoryOptions,
  SaveMemoryResult,
  RecallOptions,
  RecallResult,
  ExtractOptions,
  ExtractResult,
  ContextOptions,
  ListOptions,
  UpdateMemoryOptions,
  IngestOptions,
  IngestResult,
  SessionSummaryOptions,
  ExportResult,
  ImportResult,
  MemoryVersion,
  UsageStats,
  TeamMember,
  MemoryLink,
  PromotionCandidate,
  Memory,
  GuardCheckOptions,
  GuardCheckResult,
  ReviewWorkOptions,
  ReviewWorkResult,
  GuardRule,
  IntentViolation,
  IntentDocument,
} from "./types.js";

export type {
  CogmemAiOptions,
  SaveMemoryOptions,
  SaveMemoryResult,
  RecallOptions,
  RecallResult,
  ExtractOptions,
  ExtractResult,
  ContextOptions,
  ListOptions,
  UpdateMemoryOptions,
  IngestOptions,
  IngestResult,
  SessionSummaryOptions,
  ExportResult,
  ImportResult,
  MemoryVersion,
  UsageStats,
  TeamMember,
  MemoryLink,
  PromotionCandidate,
  Memory,
  GuardCheckOptions,
  GuardCheckResult,
  GuardRule,
  ReviewWorkOptions,
  ReviewWorkResult,
  IntentViolation,
  IntentDocument,
};

/** Error thrown by CogmemAi API calls. */
export class CogmemAiError extends Error {
  statusCode: number | undefined;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "CogmemAiError";
    this.statusCode = statusCode;
  }
}

const DEFAULT_BASE_URL = "https://hifriendbot.com/wp-json/hifriendbot/v1";

/**
 * CogmemAi SDK client.
 *
 * @example
 * ```ts
 * import { CogmemAi } from "cogmemai-sdk";
 *
 * const client = new CogmemAi({ apiKey: "cm_your_key" });
 *
 * await client.saveMemory({
 *   content: "This project uses React with TypeScript",
 *   memory_type: "architecture",
 *   importance: 8,
 * });
 *
 * const results = await client.recallMemories({ query: "what framework?" });
 * ```
 */
export class CogmemAi {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  constructor(options: CogmemAiOptions) {
    if (!options.apiKey || !options.apiKey.startsWith("cm_")) {
      throw new Error("API key must start with 'cm_'");
    }
    this.apiKey = options.apiKey;
    this.baseUrl = (options.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "");
    this.timeout = options.timeout || 30000;
  }

  // ── Internal helpers ───────────────────────────────

  private async request<T>(method: string, path: string, body?: unknown, params?: Record<string, string>): Promise<T> {
    let url = `${this.baseUrl}/cogmemai/${path}`;
    if (params) {
      const qs = new URLSearchParams(params).toString();
      if (qs) url += `?${qs}`;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const resp = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      let data: any;
      try {
        data = await resp.json();
      } catch {
        throw new CogmemAiError(`Invalid JSON response`, resp.status);
      }

      if (!resp.ok) {
        const msg = data?.error || data?.message || `HTTP ${resp.status}`;
        throw new CogmemAiError(msg, resp.status);
      }

      return data as T;
    } finally {
      clearTimeout(timer);
    }
  }

  private get<T>(path: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>("GET", path, undefined, params);
  }

  private post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("POST", path, body);
  }

  private patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PATCH", path, body);
  }

  private del<T>(path: string): Promise<T> {
    return this.request<T>("DELETE", path);
  }

  // ── Core Memory ────────────────────────────────────

  /** Save a memory. */
  async saveMemory(options: SaveMemoryOptions): Promise<SaveMemoryResult> {
    return this.post<SaveMemoryResult>("store", {
      content: options.content,
      memory_type: options.memory_type || "context",
      category: options.category || "general",
      subject: options.subject || "",
      importance: options.importance ?? 5,
      scope: options.scope || "project",
      project_id: options.project_id || "",
    });
  }

  /** Semantic search across memories. */
  async recallMemories(options: RecallOptions): Promise<RecallResult> {
    const body: Record<string, unknown> = {
      query: options.query,
      limit: options.limit || 10,
      scope: options.scope || "all",
    };
    if (options.memory_type) body.memory_type = options.memory_type;
    return this.post<RecallResult>("recall", body);
  }

  /** Extract memories from a conversation exchange using Ai. */
  async extractMemories(options: ExtractOptions): Promise<ExtractResult> {
    const body: Record<string, unknown> = { user_message: options.user_message };
    if (options.assistant_response) body.assistant_response = options.assistant_response;
    if (options.previous_context) body.previous_context = options.previous_context;
    return this.post<ExtractResult>("extract", body);
  }

  /** Load project context with smart ranking. */
  async getProjectContext(options: ContextOptions = {}): Promise<RecallResult> {
    const params: Record<string, string> = {
      include_global: String(options.include_global ?? true),
    };
    if (options.project_id) params.project_id = options.project_id;
    if (options.context) params.context = options.context;
    return this.get<RecallResult>("context", params);
  }

  /** List memories with filters. */
  async listMemories(options: ListOptions = {}): Promise<{ memories: Memory[] }> {
    const params: Record<string, string> = {
      limit: String(options.limit || 50),
      offset: String(options.offset || 0),
      scope: options.scope || "all",
    };
    if (options.memory_type) params.memory_type = options.memory_type;
    if (options.category) params.category = options.category;
    return this.get<{ memories: Memory[] }>("memories", params);
  }

  /** Update a memory. */
  async updateMemory(memoryId: number, options: UpdateMemoryOptions): Promise<{ updated: boolean }> {
    return this.patch<{ updated: boolean }>(`memory/${memoryId}`, options);
  }

  /** Delete a memory permanently. */
  async deleteMemory(memoryId: number): Promise<{ deleted: boolean }> {
    return this.del<{ deleted: boolean }>(`memory/${memoryId}`);
  }

  /** Get usage stats and tier info. */
  async getUsage(): Promise<UsageStats> {
    return this.get<UsageStats>("usage");
  }

  // ── Documents & Sessions ───────────────────────────

  /** Extract memories from a document. */
  async ingestDocument(options: IngestOptions): Promise<IngestResult> {
    const body: Record<string, unknown> = { text: options.text };
    if (options.document_type) body.document_type = options.document_type;
    if (options.project_id) body.project_id = options.project_id;
    return this.post<IngestResult>("ingest", body);
  }

  /** Save a session summary. */
  async saveSessionSummary(options: SessionSummaryOptions): Promise<SaveMemoryResult> {
    const body: Record<string, unknown> = { summary: options.summary };
    if (options.project_id) body.project_id = options.project_id;
    return this.post<SaveMemoryResult>("session-summary", body);
  }

  // ── Import / Export / Versions ─────────────────────

  /** Export all memories as JSON. */
  async exportMemories(): Promise<ExportResult> {
    return this.get<ExportResult>("export");
  }

  /** Bulk import memories. */
  async importMemories(memories: SaveMemoryOptions[]): Promise<ImportResult> {
    return this.post<ImportResult>("import", { memories });
  }

  /** Get version history for a memory. */
  async getMemoryVersions(memoryId: number): Promise<{ versions: MemoryVersion[] }> {
    return this.get<{ versions: MemoryVersion[] }>(`memory/${memoryId}/versions`);
  }

  // ── Team & Collaboration ──────────────────────────

  /** List team members. Requires Team or Enterprise tier. */
  async getTeamMembers(projectId?: string): Promise<{ members: TeamMember[] }> {
    const params: Record<string, string> = {};
    if (projectId) params.project_id = projectId;
    return this.get<{ members: TeamMember[] }>("team/members", params);
  }

  /** Invite a team member. Requires Team or Enterprise tier. */
  async inviteTeamMember(email: string, projectId: string, role: string = "member"): Promise<{ success: boolean }> {
    return this.post<{ success: boolean }>("team/invite", { email, project_id: projectId, role });
  }

  /** Remove a team member. */
  async removeTeamMember(memberId: number): Promise<{ success: boolean }> {
    return this.del<{ success: boolean }>(`team/remove/${memberId}`);
  }

  // ── Memory Relationships & Promotion ──────────────

  /** Link two related memories. */
  async linkMemories(memoryId: number, relatedMemoryId: number, relationshipType: string): Promise<{ success: boolean }> {
    return this.post<{ success: boolean }>(`memory/${memoryId}/link`, {
      related_memory_id: relatedMemoryId,
      relationship_type: relationshipType,
    });
  }

  /** Get linked memories. */
  async getMemoryLinks(memoryId: number): Promise<{ links: MemoryLink[] }> {
    return this.get<{ links: MemoryLink[] }>(`memory/${memoryId}/links`);
  }

  /** Find cross-project patterns eligible for global promotion. */
  async getPromotionCandidates(): Promise<{ candidates: PromotionCandidate[] }> {
    return this.get<{ candidates: PromotionCandidate[] }>("promotion-candidates");
  }

  /** Promote a project memory to global scope. */
  async promoteToGlobal(memoryId: number): Promise<{ success: boolean }> {
    return this.post<{ success: boolean }>(`memory/${memoryId}/promote`, {});
  }

  // ─── Guard and review: the memory that says no, and checks the work ───

  /**
   * Ask before acting. Judges an action against the rules this person has
   * asked their Ai to keep (rule memories, global and project) and the NEVER
   * and MUST lines of the project intent. Returns allow, ask or deny with the
   * rule that applies. Fails open: an error is an allow with judged=false.
   */
  async guardCheck(options: GuardCheckOptions): Promise<GuardCheckResult> {
    return this.post<GuardCheckResult>("guard-check", {
      action: options.action,
      kind: options.kind ?? "action",
      context: options.context ?? "",
      project_id: options.project_id ?? "",
    });
  }

  /**
   * Review finished work against the intent. Pass a description, output,
   * message or transcript; the project intent document is used, or an
   * inline intent when there is none. Returns a plain summary, what the
   * intent covers, what it does not, and any violations.
   */
  async reviewWork(options: ReviewWorkOptions): Promise<ReviewWorkResult> {
    const body: Record<string, unknown> = { work: options.work, project_id: options.project_id ?? "" };
    if (options.intent) body.intent = options.intent;
    return this.post<ReviewWorkResult>("intent-check", body);
  }

  /** Read a project's intent document. */
  async getIntent(projectId: string): Promise<IntentDocument> {
    return this.get<IntentDocument>("intent", { project_id: projectId });
  }

  /** Write a project's intent document: purpose, invariants, decisions, out of scope. */
  async setIntent(projectId: string, content: string, changedBy: string = "user"): Promise<{ success: boolean; memory_id?: number }> {
    return this.post<{ success: boolean; memory_id?: number }>("intent", { project_id: projectId, content, changed_by: changedBy });
  }
}
