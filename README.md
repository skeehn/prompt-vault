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
| `pv test <id>`        | Run the prompt through an LLM (requires API key) |
| `pv diff <id1> <id2>` | Diff two prompt versions side-by-side |

## Environment

Set your OpenAI key before using `