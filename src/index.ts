import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import type { WebSearchResult, WebSearchSource } from '@deepseek-ai/dsh-web'

export const name = 'console-web-search'
export const inject = ['tools', 'web']

const MAX_RESULTS = 8
const TIMEOUT_MS = 60_000

function sourceLabel(source: WebSearchSource): string {
  if (source.title) return source.title

  try {
    return new URL(source.url).hostname
  } catch {
    return source.url
  }
}

export function formatSearchOutput(result: WebSearchResult): string {
  const parts: string[] = []

  if (result.content) parts.push(result.content)

  if (result.sources.length > 0) {
    const sources = result.sources.map((source) => {
      const details = [source.snippet, source.publishedAt && `(${source.publishedAt})`]
        .filter(Boolean)
        .join(' ')
      return `- [${sourceLabel(source)}](${source.url})${details ? ` — ${details}` : ''}`
    })
    parts.push(`Sources:\n${sources.join('\n')}`)
  } else if (!result.content) {
    parts.push('No results found.')
  }

  if (result.truncated) {
    parts.push(`(Showing the first ${result.sources.length} sources. Refine the query for more.)`)
  }

  parts.push('Cite the relevant URLs above as markdown links in your answer.')
  return parts.join('\n\n')
}

export function apply(ctx: Context): void {
  ctx.tools.register(defineTool({
    name: 'console_web_search',
    description: 'Search the web for current information. Use this Console Go-safe tool instead of web_search.',
    parameters: {
      query: {
        type: 'string',
        required: true,
        description: 'The search query.',
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          content: { type: 'string' },
          sources: {
            type: 'array',
            required: true,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                url: { type: 'string', required: true },
                title: { type: 'string' },
                snippet: { type: 'string' },
                publishedAt: { type: 'string' },
              },
            },
          },
          truncated: { type: 'boolean', required: true },
        },
      },
      render: (_args, value) => [{ type: 'text', text: formatSearchOutput(value) }],
    },
    timeoutMs: TIMEOUT_MS,
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      const query = args.query.trim()
      if (!query) throw new Error('query must be a non-empty string')

      const result = await ctx.web.search({ query, maxResults: MAX_RESULTS }, exec.signal)
      return {
        ...(result.content === undefined ? {} : { content: result.content }),
        sources: result.sources.map((source) => ({
          url: source.url,
          ...(source.title === undefined ? {} : { title: source.title }),
          ...(source.snippet === undefined ? {} : { snippet: source.snippet }),
          ...(source.publishedAt === undefined ? {} : { publishedAt: source.publishedAt }),
        })),
        truncated: result.truncated,
      }
    },
  }))
}
