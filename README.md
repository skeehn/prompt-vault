# PromptVault (Mini App)

An open-source, model-agnostic CLI to manage and version your AI prompts right alongside your code.

## Quick Start

1. Install dependencies & build:

```bash
npm install
npm run build
```

2. Initialise a new vault:

```bash
pv init
# or specify a folder
pv init ./my-project
```

3. Add a prompt:

```bash
cd my-project
pv add "Translate to French: {{text}}" --tags translate,fr
```

4. Browse & lint:

```bash
pv list    # show prompts in the vault
pv lint    # run basic lint rules (length, tags, front-matter)
```

## MVP Commands

| Command                | Description                                  |
| ---------------------- | -------------------------------------------- |
| `pv init`              | Bootstrap a vault (creates `vault/`, config) |
| `pv add <prompt>`      | Scaffold a new prompt with YAML metadata     |
| `pv list`              | List prompts stored in the vault             |
| `pv lint`              | Enforce simple style rules                   |

## File Format

Prompts live as Markdown with YAML front-matter:

```markdown
---
id: 123e4567-e89b-12d3-a456-426614174000
tags:
  - translate
  - fr
created: 2024-02-20T12:00:00Z
---
Translate the following text to French:
{{text}}
```

## Roadmap

* `pv test` – run prompts against any LLM connector & log results.
* `pv diff` – side-by-side diff between prompt versions.
* VSCode extension to browse & insert `.pv.md` files.

––
MIT License.
