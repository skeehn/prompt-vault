import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';

function getVaultDir(): string {
  const configPath = path.join(process.cwd(), 'promptvault.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8')) as { vaultDir: string };
    return path.join(process.cwd(), config.vaultDir);
  }
  // fallback to default
  return path.join(process.cwd(), 'vault');
}

export function addPrompt(promptText: string, tags: string[] = []): void {
  const vaultDir = getVaultDir();
  if (!fs.existsSync(vaultDir)) {
    console.error(chalk.red('❌ Vault directory not found. Have you run "pv init"?'));
    return;
  }

  const id = uuidv4();
  const filename = `${id}.pv.md`;
  const filePath = path.join(vaultDir, filename);

  const metadata = {
    id,
    tags,
    created: new Date().toISOString(),
  };

  const frontMatter = `---\n${yaml.dump(metadata)}---\n`;

  fs.writeFileSync(filePath, `${frontMatter}\n${promptText}\n`, 'utf8');
  console.log(chalk.green(`✔ Added prompt to ${filePath}`));
}