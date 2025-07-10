# PromptVault  <img src="https://raw.githubusercontent.com/promptvault/promptvault/main/vscode-extension/resources/icon.svg" height="24"/>

> The open-source **prompt management ecosystem** – CLI + VSCode extension – that treats prompts as first-class code.

[![MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE) ![build](https://img.shields.io/badge/build-passing-brightgreen)

---

## ✨ Why PromptVault?
* **Model-agnostic** – plug in OpenAI, Anthropic, local Llama, you name it.
* **Git-native** – prompts live beside code as Markdown with YAML front-matter.
* **CI-ready** – `pv lint` & `pv test` integrate into any pipeline.
* **Extensible** – write formatters, linters, connectors on NPM/PyPI.

## 🚀 Quick Start

```bash
# 1. Clone & bootstrap
 git clone https://github.com/promptvault/promptvault.git
 cd promptvault
 npm install && npm run build

# 2. Create a vault in your project
 node dist/index.js init             # or simply "pv init" once globally linked

# 3. Craft a prompt 🎨
 node dist/index.js add "Translate to French: {{text}}" -t translate,fr

# 4. Explore
 node dist/index.js list
 node dist/index.js lint
```

### Optional: VSCode Extension
```bash
# build & install the sidebar extension
npm --prefix vscode-extension install
npm --prefix vscode-extension run compile
npx --yes vsce package --no-yarn    # produces promptvault-vscode-0.1.0.vsix
code --install-extension promptvault-vscode-0.1.0.vsix
```

The PromptVault icon appears → browse prompts & hit *Run Prompt* to execute `pv test <id>` right inside VSCode.

---

## 🖥  CLI Commands
| Command | Description |
|---------|-------------|
| `pv init` | Scaffold `vault/` and `promptvault.json` |
| `pv add <prompt>` | Create a new prompt file with YAML metadata |
| `pv list` | List all prompts in the vault |
| `pv lint` | Enforce style rules (length, tags, front-matter) |
| `pv test <id>` | Run prompt through an LLM connector (needs `OPENAI_API_KEY`) |
| `pv diff <id1> <id2>` | Side-by-side diff between two prompts |

---

## 🧩 Architecture
* **CLI:** Node/TypeScript (single binary via `pkg` coming soon)
* **Storage:** Markdown + YAML ⇒ SQLite (optional, WIP)
* **Connectors:** OpenAI implemented, HuggingFace & Anthropic planned
* **VSCode:** Custom TreeView provider with *Run Prompt* command

---

## 🗺  Roadmap
| Milestone | ETA |
|-----------|-----|
| `pv package` (bundle into single executable) | Aug 2025 |
| Multi-model test matrix & perf dashboards | Sep 2025 |
| Plugin marketplace | Q4 2025 |

---

## 🗣  Spread the word → *Announcement Snippet*

> 🚀 Introducing **#PromptVault** – the open-source prompt repo & CLI that puts *prompt-ops* next to your CI pipeline. Git-native diffs, linting, VSCode sidebar, model-agnostic testing. Clone, `pv init`, and level-up your prompt game today!  
> 🔗 https://github.com/promptvault/promptvault

---

## 📝 License
[MIT](LICENSE)

> Built with ☕ by the community – PRs welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)