import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import chalk from 'chalk';
function getVaultDir() {
    const configPath = path.join(process.cwd(), 'promptvault.json');
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return path.join(process.cwd(), config.vaultDir);
    }
    return path.join(process.cwd(), 'vault');
}
export function listPrompts() {
    const vaultDir = getVaultDir();
    if (!fs.existsSync(vaultDir)) {
        console.error(chalk.red('❌ Vault directory not found. Have you run "pv init"?'));
        return;
    }
    const files = fs.readdirSync(vaultDir).filter((f) => f.endsWith('.pv.md'));
    if (files.length === 0) {
        console.log(chalk.yellow('No prompts found.'));
        return;
    }
    console.log(chalk.blue(`📂 PromptVault (${files.length} prompts):`));
    files.forEach((file) => {
        const content = fs.readFileSync(path.join(vaultDir, file), 'utf8');
        const match = content.match(/^---\n([\s\S]*?)\n---/);
        if (match) {
            try {
                const meta = yaml.load(match[1]);
                console.log(chalk.green(`• ${meta.id}`) + (meta.tags?.length ? chalk.gray(` [${meta.tags.join(', ')}]`) : ''));
            }
            catch {
                console.log(chalk.red(`Error parsing metadata for ${file}`));
            }
        }
    });
}
