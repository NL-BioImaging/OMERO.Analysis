# Local LLM Recommendations for the Analysis Assistant

Last reviewed: 2026-08-05

The Analysis Assistant needs more than ordinary chat quality. A suitable local
model must reliably produce structured tool calls, write Python and SQL, use
tool results across several rounds, repair failed code, and finish with a
complete reusable Method. In LM Studio, prefer models marked with the native
tool-use/hammer badge. LM Studio reports that native tool-use models generally
perform better than models using its fallback tool format.

Ollama is also supported through its OpenAI-compatible API. Prefer official
Ollama Library models marked `tools`, use the exact model tag listed below, and
keep Ollama updated because tool calling and model templates are runtime
features as well as model features.

The hosted GPT-5.x configuration through OpenAI or Azure OpenAI remains the
recommended production default. The following local models are useful for
offline operation, development, and lower-cost fallback profiles.

## Recommendations by hardware

The GPU figures below refer to dedicated VRAM. CPU-only recommendations assume
at least 16 GB system RAM; 32 GB or more is preferable.

| Hardware | Recommended model | Practical configuration | Expected use |
| --- | --- | --- | --- |
| CPU only, 16 GB RAM | Qwen3-4B-Instruct-2507 | GGUF Q4_K_M, 8–16K context | Testing and simple Methods |
| CPU only, 32 GB+ RAM | Ministral 3 8B Instruct | GGUF Q4_K_M, 16K context | Better tools and scripts, but slow |
| 8 GB GPU | Ministral 3 8B Instruct | GGUF Q4_K_M, 12–16K context | Best small-model balance |
| 16 GB GPU | gpt-oss-20b | Native MXFP4, low reasoning, 16–24K context | Minimum tier recommended for regular use |
| 24 GB GPU | Qwen3-Coder-30B-A3B-Instruct | GGUF Q4_K_M, 32–64K context | Conservative best choice for Python/SQL Methods |
| 24 GB GPU, experimental | Qwen3.6-27B | GGUF Q4_K_M, 32–48K context | Potentially higher quality; verify native tool support |

Using the model from the tier below is a reasonable speed-first option.

## Suggested LM Studio profiles

### Local Fast

- Model: Ministral 3 8B Instruct
- Quantization: Q4_K_M
- Context: 16K
- Use for: short Methods, simple inspection, and UI testing

### Local Balanced

- Model: gpt-oss-20b
- Format: native MXFP4
- Reasoning effort: low
- Context: 16–24K on a 16 GB GPU
- Use for: routine tool-based Method development

### Local Best

- Model: Qwen3-Coder-30B-A3B-Instruct
- Quantization: Q4_K_M
- Context: start at 32K; increase toward 48–64K only when memory permits
- Use for: longer Python/SQL analyses and multi-step error recovery

Qwen3.6-27B is worth evaluating as a higher-quality alternative on a 24 GB
GPU, but it should replace Qwen3-Coder only after representative Assistant
turns demonstrate equally reliable native tool calls.

## Suggested Ollama profiles

The official Ollama model tags corresponding to the hardware recommendations
are:

| Hardware | Preferred Ollama model | Alternative | Starting context |
| --- | --- | --- | --- |
| CPU only, 16 GB RAM | `qwen3:4b-instruct` | — | 8K |
| CPU only, 32 GB+ RAM | `ministral-3:8b` | `qwen3:8b` | 12–16K |
| 8 GB GPU | `ministral-3:8b` | `qwen3:8b` | 12–16K |
| 16 GB GPU | `gpt-oss:20b` | `ministral-3:14b` for more memory headroom | 12–16K |
| 24 GB GPU | `qwen3-coder:30b` | `qwen3.6:27b` after validation | 24–32K |

Pull only the model needed for the selected profile, for example:

```powershell
ollama pull ministral-3:8b
ollama pull gpt-oss:20b
ollama pull qwen3-coder:30b
```

In OMERO.Analysis, use:

- Endpoint: `http://localhost:11434/v1`
- API key: `ollama` (the local Ollama API ignores it, but OpenAI-compatible
  clients may require a non-empty value)
- Model: the exact Ollama tag, such as `ministral-3:8b`
- Context window: the context actually allocated by Ollama, not the model's
  advertised architectural maximum

Ollama may allocate only a small default context on consumer GPUs. Set the
desired context in the Ollama app, or set `OLLAMA_CONTEXT_LENGTH` before
starting the server. For a temporary PowerShell session:

```powershell
$env:OLLAMA_CONTEXT_LENGTH = "16384"
ollama serve
```

After starting an Assistant request, run `ollama ps` and inspect `PROCESSOR`.
Prefer `100% GPU` when using a GPU. CPU/GPU splitting is supported, but usually
reduces interactive speed. If a 16 GB GPU cannot keep `gpt-oss:20b` and the
chosen context in VRAM, use `ministral-3:14b`, shorten the context, or accept
partial CPU offload.

If the browser reports a CORS or connection error, allow the exact
OMERO.Analysis web origin with `OLLAMA_ORIGINS`, then restart Ollama. Do not use
`*` when one specific origin is sufficient.

## Important context limitation

Real Assistant conversations can grow to tens of thousands of prompt tokens
because they include system instructions, data schemas, skills, tool calls,
tool results, repair attempts, and recent conversation history. Architectural
context limits such as 128K or 256K do not mean that the full limit is
practical on consumer hardware: model weights, the KV cache, runtime overhead,
and generated tokens must all fit in memory.

Consequently:

- CPU-only and 8 GB systems are development or simple-analysis tiers.
- A 16 GB GPU is useful when active context stays around 16–24K.
- A 24 GB GPU is the realistic local tier for the complete Assistant and
  longer analysis skills.
- Hosted GPT-5.x remains preferable for the highest reliability and unusually
  long or complex turns.

If LM Studio runs out of memory or begins spilling heavily into system RAM,
or if `ollama ps` reports more CPU offload than intended, reduce context before
choosing a lower quantization. A slightly larger model with an impractically
large context can be slower and less useful than a smaller model with enough
headroom. Configure OMERO.Analysis with the same effective context limit so it
can compact the conversation before the local runtime reaches its limit.

## Selection rules

1. Prefer an official Instruct model with LM Studio's native tool-use badge or
   the Ollama Library `tools` capability.
2. Avoid base models, uncensored merges, and models that only generate
   plausible-looking Python without reliable function calls.
3. Start with a new Assistant conversation when benchmarking so old context
   does not distort latency or quality.
4. Use the same representative prompts and measure:
   - successful tool-call parsing;
   - number of Python retries;
   - total prompt and response tokens;
   - time to the final Assistant response;
   - whether the final response contains a complete reusable Method;
   - whether every claimed output exists.
5. Count lower latency or token usage as an improvement only when the Method
   and its outputs remain correct.

## Sources

- [LM Studio tool-use documentation](https://lmstudio.ai/docs/developer/openai-compat/tools)
- [LM Studio: Qwen3-4B-Instruct-2507](https://lmstudio.ai/models/qwen/qwen3-4b-2507)
- [LM Studio: Ministral 3 8B](https://lmstudio.ai/models/mistralai/ministral-3-8b)
- [OpenAI: Introducing gpt-oss](https://openai.com/index/introducing-gpt-oss/)
- [LM Studio: gpt-oss](https://lmstudio.ai/models/gpt-oss)
- [Qwen: Qwen3-Coder-30B-A3B-Instruct model card](https://huggingface.co/Qwen/Qwen3-Coder-30B-A3B-Instruct)
- [LM Studio: Qwen3-Coder](https://lmstudio.ai/models/qwen3-coder)
- [Qwen: Qwen3.6-27B model card](https://huggingface.co/Qwen/Qwen3.6-27B)
- [Ollama OpenAI compatibility](https://docs.ollama.com/api/openai-compatibility)
- [Ollama tool calling](https://docs.ollama.com/capabilities/tool-calling)
- [Ollama context length](https://docs.ollama.com/context-length)
- [Ollama FAQ: server, origins, and GPU allocation](https://docs.ollama.com/faq)
- [Ollama: Qwen3 model tags](https://ollama.com/library/qwen3/tags)
- [Ollama: Ministral 3](https://ollama.com/library/ministral-3)
- [Ollama: gpt-oss 20B](https://ollama.com/library/gpt-oss:20b)
- [Ollama: Qwen3-Coder](https://ollama.com/library/qwen3-coder)
- [Ollama: Qwen3.6](https://ollama.com/library/qwen3.6)
