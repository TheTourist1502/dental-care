---
name: headroom
description: >
  Context compression layer for AI agents. Reduces token usage 60–95% by compressing
  tool outputs, logs, RAG chunks, files, and conversation history before they reach
  the LLM — without changing answers. Backed by the Headroom CLI (headroom-ai pip/npm).
  Use when context is growing large, costs are high, or token limits are near.
  Invoke with /headroom. Args: wrap|proxy|stats|learn|perf.
---

The user wants to use Headroom to reduce token usage or manage context compression.
Headroom requires the CLI to be installed: `pip install "headroom-ai[all]"` or `npm install headroom-ai`.

## When invoked

Determine the user's intent from the argument or context:

### `/headroom` (no arg) — check status and savings

```bash
headroom perf        # show token savings stats for recent sessions
headroom stats       # summary of current session compression ratios
```

Report what compression is active and current savings. If headroom is not installed, show install instructions.

### `/headroom wrap` — wrap Claude Code

```bash
headroom wrap claude
```

Starts Claude Code through the Headroom proxy so all context is compressed transparently.
Explain: this re-routes stdin/stdout through the compressor; no code changes needed.

### `/headroom proxy` — drop-in OpenAI-compatible proxy

```bash
headroom proxy --port 8787
```

Starts a local proxy on port 8787. Point any OpenAI SDK client at `http://localhost:8787`
and it compresses every request before forwarding. Zero code changes required.

### `/headroom learn` — mine sessions and update CLAUDE.md

```bash
headroom learn
```

Headroom scans recent failed/interrupted sessions, extracts patterns, and appends
corrections and preferences to `CLAUDE.md` / `AGENTS.md`. Run after a bad session
to capture what went wrong.

### `/headroom perf` — show benchmark/savings

```bash
headroom perf
```

Prints a per-workload breakdown of token savings from recent real sessions.

## Startup hook

The `hooks.json` in this skill directory registers a `SessionStart` hook that runs
`headroom init hook ensure` to start the local Headroom runtime automatically when
Claude Code starts. To activate it, merge the hooks into `.claude/settings.json`.

## Output token reduction

Headroom can also shrink what the model *writes back* (preambles, restated code, deep
"thinking" on trivial steps):

```bash
export HEADROOM_OUTPUT_SHAPER=1
headroom proxy --port 8787
```

## Key commands reference

| Command | What it does |
|---|---|
| `headroom wrap claude` | Transparent compression for Claude Code |
| `headroom proxy --port 8787` | Drop-in proxy for any app |
| `headroom perf` | Show token savings |
| `headroom stats` | Session compression summary |
| `headroom learn` | Mine sessions → update CLAUDE.md |
| `headroom init` | Initialise a persistent runtime |
| `headroom init hook ensure` | Ensure runtime is alive (used by hooks) |

## Algorithms

Headroom routes content through the best compressor per type:
- **SmartCrusher** — JSON / structured tool outputs
- **CodeCompressor** — AST-aware source code compression
- **Kompress-base** — prose, logs, free-form text (local HF model)
- **CacheAligner** — stabilises prompt prefixes so provider KV cache actually hits
- **CCR** — stores originals locally; model can call `headroom_retrieve` to get them back

## Install

```bash
# Python (recommended — all extras)
pip install "headroom-ai[all]"

# Node / TypeScript
npm install headroom-ai
```

Requires Python 3.10+. See https://github.com/chopratejas/headroom for full docs.
