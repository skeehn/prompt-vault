# Contributing to PromptVault

First off, thanks for taking the time to contribute! 🙏

PromptVault is **open-core**.  The goal is to build an ecosystem around prompt management that scales from solo hackers to enterprise "prompt-ops" teams.

---

## 📋 Ground Rules

1. **Be Nice** –  Follow the [Rust Code of Conduct](https://www.rust-lang.org/policies/code-of-conduct).
2. **Open an Issue First** –  For anything bigger than a typo, start the discussion in an issue.
3. **One Feature / Bug-fix per PR** –  Keep pull-requests focused.
4. **Tests & Docs** –  If you add code, add or update docs & basic tests.
5. **Conventional Commits** –  We use the [`feat:`/`fix:`] prefix pattern.

## 🛠 Project Structure

```
/                   –  main TypeScript CLI (pv)
/vscode-extension/  –  VSCode sidebar extension
/vault/             –  example prompts (created after `pv init`)
```

Key **ownership** files:
* `src/modules/*` – core CLI features
* `vscode-extension/src/extension.ts` – sidebar provider

## 🏃‍ Build & Test

```bash
# install root deps + build
npm install
npm run build

# build the VSCode extension
npm --prefix vscode-extension install
npm --prefix vscode-extension run compile
```

Run the full **CLI test matrix**:
```bash
npm run test       # (coming soon – uses vitest)
```

## 👀 Style Guide
* **TypeScript strict** (`noImplicitAny`, etc.)
* 2-space indentation
* Prefer `node:` imports for built-ins
* No default exports

## ✨ Wanted
* Connectors for HuggingFace, Anthropic, Llama.cpp
* Lint rules catalogue (grammar-checker, placeholders analysis,…)
* Prompt performance dashboards

---
Made with ☕ & 💙 – join the convo in [Discussions](https://github.com/promptvault/promptvault/discussions)