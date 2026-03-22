# Project: 3D Drink Cup Customizer (AI Updates)

## AI Generation Architecture
We have completely transitioned the image generation mechanism from the native Google Gen AI libraries to the universal **OpenRouter API**.

### AI Core
- **API Provider**: OpenRouter (`https://openrouter.ai/api/v1/chat/completions`)
- **Selected Model**: `google/gemini-3.1-flash-image-preview`
- **Mechanism**: The Text-to-Image request is funneled through OpenRouter's proxy which interfaces with Gemini 3.1 Flash Image preview. The returned string payload is regex-parsed on our client to extract the generated image source automatically.
- **Environment Requirement**: `NEXT_PUBLIC_OPENROUTER_API_KEY` defined inside `.env.local`

### Core Changes
- Removed dependencies on `@google/genai` or `@google/generative-ai`.
- `gemini.ts` was repurposed into an generic external `fetch` abstraction that parses OpenRouter outputs.