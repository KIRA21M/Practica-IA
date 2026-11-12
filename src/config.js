import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT || 3000),
  aiProvider: process.env.AI_PROVIDER || 'anthropic',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929',
  anthropicBaseUrl: process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com/v1',
  openAiApiKey: process.env.OPENAI_API_KEY || '',
  openAiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  openAiBaseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  generationTimeoutMs: Number(process.env.GENERATION_TIMEOUT_MS || 20000)
};

export function hasGenerativeApiKey() {
  return config.aiProvider === 'anthropic' ? Boolean(config.anthropicApiKey) : Boolean(config.openAiApiKey);
}
