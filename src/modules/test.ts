import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import chalk from 'chalk';
import { callOpenAI } from '../connectors/openai.js';

function getVaultDir(): string {
  const configPath = path.join(process.cwd(), 'promptvault.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8')) as { vaultDir: string };
    return path.join(process.cwd(), config.vaultDir);
  }
  return path.join(process.cwd(), 'vault');
}

function findPromptFileById(vaultDir: string, id: string): string | null {
  const files = fs.readdirSync(vaultDir).filter((f: string) => f.endsWith('.pv.md'));
  for (const file of files) {
    if (file.startsWith(id)) return path.join(vaultDir, file);
    const content = fs.readFileSync(path.join(vaultDir, file), 'utf8');
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (match) {
      try {
        const meta = yaml.load(match[1]) as any;
        if (meta?.id === id) return path.join(vaultDir, file);
      } catch {
        /* ignore */
      }
    }
  }
  return null;
}

export async function testPrompt(id: string, model: string): Promise<void> {
  const vaultDir = getVaultDir();
  if (!fs.existsSync(vaultDir)) {
    console.error(chalk.red('❌ Vault directory not found. Have you run "pv init"?'));
    return;
  }
  const filePath = findPromptFileById(vaultDir, id);
  if (!filePath) {
    console.error(chalk.red(`❌ Prompt with id '${id}' not found.`));
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const promptBody = content.split(/---[\s\S]*?---/)[1]?.trim() || '';
  console.log(chalk.blue(`🚀 Testing prompt '${id}' with model ${model}...`));
  try {
    const response = await callOpenAI(model, promptBody);
    console.log(chalk.green('✔ Model response:'));
    console.log(response);
  } catch (err: any) {
    console.error(chalk.red(`Error invoking model: ${err.message}`));
  }
}