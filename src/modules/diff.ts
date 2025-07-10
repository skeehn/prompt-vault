import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import { diffLines, Change } from 'diff';
import yaml from 'js-yaml';

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

export function diffPrompts(id1: string, id2: string): void {
  const vaultDir = getVaultDir();
  if (!fs.existsSync(vaultDir)) {
    console.error(chalk.red('❌ Vault directory not found. Have you run "pv init"?'));
    return;
  }
  const fileA = findPromptFileById(vaultDir, id1);
  const fileB = findPromptFileById(vaultDir, id2);
  if (!fileA || !fileB) {
    console.error(chalk.red('❌ One or both prompt IDs not found.'));
    return;
  }
  const contentA = fs.readFileSync(fileA, 'utf8');
  const contentB = fs.readFileSync(fileB, 'utf8');

  const diff = diffLines(contentA, contentB);
  diff.forEach((part: Change) => {
    const color = part.added ? chalk.green : part.removed ? chalk.red : chalk.gray;
    process.stdout.write(color(part.value));
  });
  process.stdout.write('\n');
}