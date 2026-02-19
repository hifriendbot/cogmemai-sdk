import type { CogmemAiOptions, SaveMemoryOptions, SaveMemoryResult, RecallOptions, RecallResult, ExtractOptions, ExtractResult, ContextOptions, ListOptions, UpdateMemoryOptions, IngestOptions, IngestResult, SessionSummaryOptions, ExportResult, ImportResult, MemoryVersion, UsageStats, TeamMember, MemoryLink, PromotionCandidate, Memory } from "./types.js";
export type { CogmemAiOptions, SaveMemoryOptions, SaveMemoryResult, RecallOptions, RecallResult, ExtractOptions, ExtractResult, ContextOptions, ListOptions, UpdateMemoryOptions, IngestOptions, IngestResult, SessionSummaryOptions, ExportResult, ImportResult, MemoryVersion, UsageStats, TeamMember, MemoryLink, PromotionCandidate, Memory, };
/** Error thrown by CogmemAi API calls. */
export declare class CogmemAiError extends Error {
    statusCode: number | undefined;
    constructor(message: string, statusCode?: number);
}
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
export declare class CogmemAi {
    private apiKey;
    private baseUrl;
    private timeout;
    constructor(options: CogmemAiOptions);
    private request;
    private get;
    private post;
    private patch;
    private del;
    /** Save a memory. */
    saveMemory(options: SaveMemoryOptions): Promise<SaveMemoryResult>;
    /** Semantic search across memories. */
    recallMemories(options: RecallOptions): Promise<RecallResult>;
    /** Extract memories from a conversation exchange using Ai. */
    extractMemories(options: ExtractOptions): Promise<ExtractResult>;
    /** Load project context with smart ranking. */
    getProjectContext(options?: ContextOptions): Promise<RecallResult>;
    /** List memories with filters. */
    listMemories(options?: ListOptions): Promise<{
        memories: Memory[];
    }>;
    /** Update a memory. */
    updateMemory(memoryId: number, options: UpdateMemoryOptions): Promise<{
        updated: boolean;
    }>;
    /** Delete a memory permanently. */
    deleteMemory(memoryId: number): Promise<{
        deleted: boolean;
    }>;
    /** Get usage stats and tier info. */
    getUsage(): Promise<UsageStats>;
    /** Extract memories from a document. */
    ingestDocument(options: IngestOptions): Promise<IngestResult>;
    /** Save a session summary. */
    saveSessionSummary(options: SessionSummaryOptions): Promise<SaveMemoryResult>;
    /** Export all memories as JSON. */
    exportMemories(): Promise<ExportResult>;
    /** Bulk import memories. */
    importMemories(memories: SaveMemoryOptions[]): Promise<ImportResult>;
    /** Get version history for a memory. */
    getMemoryVersions(memoryId: number): Promise<{
        versions: MemoryVersion[];
    }>;
    /** List team members. Requires Team or Enterprise tier. */
    getTeamMembers(projectId?: string): Promise<{
        members: TeamMember[];
    }>;
    /** Invite a team member. Requires Team or Enterprise tier. */
    inviteTeamMember(email: string, projectId: string, role?: string): Promise<{
        success: boolean;
    }>;
    /** Remove a team member. */
    removeTeamMember(memberId: number): Promise<{
        success: boolean;
    }>;
    /** Link two related memories. */
    linkMemories(memoryId: number, relatedMemoryId: number, relationshipType: string): Promise<{
        success: boolean;
    }>;
    /** Get linked memories. */
    getMemoryLinks(memoryId: number): Promise<{
        links: MemoryLink[];
    }>;
    /** Find cross-project patterns eligible for global promotion. */
    getPromotionCandidates(): Promise<{
        candidates: PromotionCandidate[];
    }>;
    /** Promote a project memory to global scope. */
    promoteToGlobal(memoryId: number): Promise<{
        success: boolean;
    }>;
}
