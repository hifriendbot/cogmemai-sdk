"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CogmemAi = exports.CogmemAiError = void 0;
/** Error thrown by CogmemAi API calls. */
class CogmemAiError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.name = "CogmemAiError";
        this.statusCode = statusCode;
    }
}
exports.CogmemAiError = CogmemAiError;
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
class CogmemAi {
    apiKey;
    baseUrl;
    timeout;
    constructor(options) {
        if (!options.apiKey || !options.apiKey.startsWith("cm_")) {
            throw new Error("API key must start with 'cm_'");
        }
        this.apiKey = options.apiKey;
        this.baseUrl = (options.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "");
        this.timeout = options.timeout || 30000;
    }
    // ── Internal helpers ───────────────────────────────
    async request(method, path, body, params) {
        let url = `${this.baseUrl}/cogmemai/${path}`;
        if (params) {
            const qs = new URLSearchParams(params).toString();
            if (qs)
                url += `?${qs}`;
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
            let data;
            try {
                data = await resp.json();
            }
            catch {
                throw new CogmemAiError(`Invalid JSON response`, resp.status);
            }
            if (!resp.ok) {
                const msg = data?.error || data?.message || `HTTP ${resp.status}`;
                throw new CogmemAiError(msg, resp.status);
            }
            return data;
        }
        finally {
            clearTimeout(timer);
        }
    }
    get(path, params) {
        return this.request("GET", path, undefined, params);
    }
    post(path, body) {
        return this.request("POST", path, body);
    }
    patch(path, body) {
        return this.request("PATCH", path, body);
    }
    del(path) {
        return this.request("DELETE", path);
    }
    // ── Core Memory ────────────────────────────────────
    /** Save a memory. */
    async saveMemory(options) {
        return this.post("store", {
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
    async recallMemories(options) {
        const body = {
            query: options.query,
            limit: options.limit || 10,
            scope: options.scope || "all",
        };
        if (options.memory_type)
            body.memory_type = options.memory_type;
        return this.post("recall", body);
    }
    /** Extract memories from a conversation exchange using Ai. */
    async extractMemories(options) {
        const body = { user_message: options.user_message };
        if (options.assistant_response)
            body.assistant_response = options.assistant_response;
        if (options.previous_context)
            body.previous_context = options.previous_context;
        return this.post("extract", body);
    }
    /** Load project context with smart ranking. */
    async getProjectContext(options = {}) {
        const params = {
            include_global: String(options.include_global ?? true),
        };
        if (options.project_id)
            params.project_id = options.project_id;
        if (options.context)
            params.context = options.context;
        return this.get("context", params);
    }
    /** List memories with filters. */
    async listMemories(options = {}) {
        const params = {
            limit: String(options.limit || 50),
            offset: String(options.offset || 0),
            scope: options.scope || "all",
        };
        if (options.memory_type)
            params.memory_type = options.memory_type;
        if (options.category)
            params.category = options.category;
        return this.get("memories", params);
    }
    /** Update a memory. */
    async updateMemory(memoryId, options) {
        return this.patch(`memory/${memoryId}`, options);
    }
    /** Delete a memory permanently. */
    async deleteMemory(memoryId) {
        return this.del(`memory/${memoryId}`);
    }
    /** Get usage stats and tier info. */
    async getUsage() {
        return this.get("usage");
    }
    // ── Documents & Sessions ───────────────────────────
    /** Extract memories from a document. */
    async ingestDocument(options) {
        const body = { text: options.text };
        if (options.document_type)
            body.document_type = options.document_type;
        if (options.project_id)
            body.project_id = options.project_id;
        return this.post("ingest", body);
    }
    /** Save a session summary. */
    async saveSessionSummary(options) {
        const body = { summary: options.summary };
        if (options.project_id)
            body.project_id = options.project_id;
        return this.post("session-summary", body);
    }
    // ── Import / Export / Versions ─────────────────────
    /** Export all memories as JSON. */
    async exportMemories() {
        return this.get("export");
    }
    /** Bulk import memories. */
    async importMemories(memories) {
        return this.post("import", { memories });
    }
    /** Get version history for a memory. */
    async getMemoryVersions(memoryId) {
        return this.get(`memory/${memoryId}/versions`);
    }
    // ── Team & Collaboration ──────────────────────────
    /** List team members. Requires Team or Enterprise tier. */
    async getTeamMembers(projectId) {
        const params = {};
        if (projectId)
            params.project_id = projectId;
        return this.get("team/members", params);
    }
    /** Invite a team member. Requires Team or Enterprise tier. */
    async inviteTeamMember(email, projectId, role = "member") {
        return this.post("team/invite", { email, project_id: projectId, role });
    }
    /** Remove a team member. */
    async removeTeamMember(memberId) {
        return this.del(`team/remove/${memberId}`);
    }
    // ── Memory Relationships & Promotion ──────────────
    /** Link two related memories. */
    async linkMemories(memoryId, relatedMemoryId, relationshipType) {
        return this.post(`memory/${memoryId}/link`, {
            related_memory_id: relatedMemoryId,
            relationship_type: relationshipType,
        });
    }
    /** Get linked memories. */
    async getMemoryLinks(memoryId) {
        return this.get(`memory/${memoryId}/links`);
    }
    /** Find cross-project patterns eligible for global promotion. */
    async getPromotionCandidates() {
        return this.get("promotion-candidates");
    }
    /** Promote a project memory to global scope. */
    async promoteToGlobal(memoryId) {
        return this.post(`memory/${memoryId}/promote`, {});
    }
}
exports.CogmemAi = CogmemAi;
