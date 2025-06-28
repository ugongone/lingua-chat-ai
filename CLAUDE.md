# Lingua Chat AI — MVP Guidelines (CLAUDE.md)

## Mission

Enable friction-less English conversation practice:  
_Press mic → speak → get AI reply (voice + text) within 3 s._

## Scope (v1)

1. Voice I/O via Web Speech API (`SpeechRecognition`, `SpeechSynthesis`).
2. Streaming chat API: `POST /api/chat` (Edge Runtime, Vercel AI SDK).
3. UI: shadcn/ui components (MicButton, ChatBubble) in `apps/web`.
4. No DB / Auth yet. Fastify stub OK.

## Constraints

- **Keep code inside** `apps/web/**` and `app/api/**`.
- Follow ESLint / Prettier config, Tailwind class naming, shadcn style.
- Respond in English for code/comments; UI copy may be Japanese.
- Avoid breaking Turbo cache; use `turbo run dev|build|lint`.
