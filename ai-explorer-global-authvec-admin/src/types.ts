export type Tool = {
  id: string; name: string; isFree: boolean; siteUrl: string; category: string;
  supportsEmbed: boolean; embedType: 'iframe'|'api'|'linkout'; authType: 'none'|'free-login';
  capabilities: string[]; calledPromptTemplate?: string; notes?: string;
};
export type Recommendation = { rank: number; score: number; rationale: string; tool: Tool };
export type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string; ts?: string };
