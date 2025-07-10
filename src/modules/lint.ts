import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import chalk from 'chalk';

const MAX_PROMPT_LENGTH = 1000; // characters

function getVaultDir(): string {
  const configPath = path.join(process.cwd(), 'promptvault.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8')) as { vaultDir: string };
    return path.join(process.cwd(), config.vaultDir);
  }
  return path.join(process.cwd(), 'vault');
}

interface LintError {
  id: string;
  message: string;
}

export function lintVault(): void {
  const vaultDir = getVaultDir();
  if (!fs.existsSync(vaultDir)) {
    console.error(chalk.red('❌ Vault directory not found. Have you run "pv init"?'));
    return;
  }
  const files = fs.readdirSync(vaultDir).filter((f: string) => f.endsWith('.pv.md'));
  if (files.length === 0) {
    console.log(chalk.yellow('No prompts found to lint.'));
    return;
  }
  let errorCount = 0;
  files.forEach((file: string) => {
    const filePath = path.join(vaultDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const [ , metaBlock ] = content.match(/^---\n([\s\S]*?)\n---/) || [];
    let id = file.replace('.pv.md', '');
    let promptBody = content.split(/---[\s\S]*?---/)[1] || '';
    const errors: LintError[] = [];

    if (metaBlock) {
      try {
        const meta = yaml.load(metaBlock) as any;
        if (meta && meta.id) id = meta.id;
        if (!meta.tags || !(meta.tags as string[]).length) {
          errors.push({ id, message: 'Missing tags' });
        }
      } catch {
        errors.push({ id, message: 'Invalid YAML front-matter' });
      }
    } else {
      errors.push({ id, message: 'Missing front-matter' });
    }

    if (promptBody.trim().length > MAX_PROMPT_LENGTH) {
      errors.push({ id, message: `Prompt exceeds ${MAX_PROMPT_LENGTH} characters` });
    }

    if (errors.length) {
      errorCount += errors.length;
      console.log(chalk.red(`❌ ${id}`));
      errors.forEach((e) => console.log(`   - ${e.message}`));
    } else {
      console.log(chalk.green(`✔ ${id}`));
    }
  });

  if (errorCount) {
    console.log(chalk.red(`\nFound ${errorCount} lint issues.`));
  } else {
    console.log(chalk.blue('\nAll prompts passed linting!'));
  }
}