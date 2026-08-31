# CogmemAi JavaScript/TypeScript SDK

The smart memory layer for everything Ai. Persistent, encrypted recall for any Ai system: agents, assistants, robots, and the tools you already use. 95.10% on LongMemEval, the highest published score.

## Install

```bash
npm install cogmemai-sdk
```

## Quick Start

```typescript
import { CogmemAi } from "cogmemai-sdk";

const client = new CogmemAi({ apiKey: "cm_your_api_key_here" });

// Save a memory
await client.saveMemory({
  content: "This project uses React with TypeScript",
  memory_type: "architecture",
  category: "frontend",
  importance: 8,
});

// Search memories
const results = await client.recallMemories({
  query: "what framework does this project use?",
});

// Load project context
const context = await client.getProjectContext({
  projectId: "my-project",
});

// Extract memories from conversation
await client.extractMemories({
  user_message: "Let's use PostgreSQL for the database",
  assistant_response: "Good choice. I'll set up the schema with...",
});
```

## All Methods

### Core Memory
- `saveMemory(options)`, Save a memory
- `recallMemories(options)`, Semantic search
- `extractMemories(options)`, Ai extracts facts from conversation
- `getProjectContext(options?)`, Load top memories with smart ranking
- `listMemories(options?)`, Browse with filters
- `updateMemory(memoryId, options)`, Edit a memory
- `deleteMemory(memoryId)`, Delete permanently
- `getUsage()`, Check usage stats and tier

### Documents & Sessions
- `ingestDocument(options)`, Extract memories from docs
- `saveSessionSummary(options)`, Capture session accomplishments

### Import / Export
- `exportMemories()`, Back up memories as JSON
- `importMemories(memories)`, Bulk import from JSON
- `getMemoryVersions(memoryId)`, Version history

### Team & Collaboration
- `getTeamMembers(projectId?)`, List team members
- `inviteTeamMember(email, projectId, role?)`, Invite a member
- `removeTeamMember(memberId)`, Remove a member

### Memory Relationships & Promotion
- `linkMemories(memoryId, relatedMemoryId, relationshipType)`, Link related memories
- `getMemoryLinks(memoryId)`, Get linked memories
- `getPromotionCandidates()`, Find cross-project patterns
- `promoteToGlobal(memoryId)`, Promote to global scope

## Error Handling

```typescript
import { CogmemAi, CogmemAiError } from "cogmemai-sdk";

try {
  await client.saveMemory({ content: "test" });
} catch (err) {
  if (err instanceof CogmemAiError) {
    console.error(`Error ${err.statusCode}: ${err.message}`);
  }
}
```

## TypeScript

Full type definitions included. All request options and response types are exported:

```typescript
import type { Memory, SaveMemoryOptions, RecallResult } from "cogmemai-sdk";
```

## Get an API Key

1. Sign up at [hifriendbot.com/developer/](https://hifriendbot.com/developer/)
2. Generate an API key
3. Start saving memories

## Links

- [Developer Dashboard](https://hifriendbot.com/developer/)
- [MCP Server (npm)](https://www.npmjs.com/package/cogmemai-mcp)
- [Python SDK (PyPI)](https://pypi.org/project/cogmemai/)
- [GitHub](https://github.com/hifriendbot/cogmemai-sdk)
