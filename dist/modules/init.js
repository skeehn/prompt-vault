import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
export function initVault(rootDir) {
    const vaultDir = path.join(rootDir, 'vault');
    const configFile = path.join(rootDir, 'promptvault.json');
    if (!fs.existsSync(vaultDir)) {
        fs.mkdirSync(vaultDir, { recursive: true });
        console.log(chalk.green(`✔ Created vault directory at ${vaultDir}`));
    }
    else {
        console.log(chalk.yellow(`⚠ Vault directory already exists at ${vaultDir}`));
    }
    if (!fs.existsSync(configFile)) {
        const defaultConfig = {
            schemaVersion: 1,
            created: new Date().toISOString(),
            vaultDir: 'vault',
        };
        fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2), 'utf8');
        console.log(chalk.green(`✔ Created config file at ${configFile}`));
    }
    else {
        console.log(chalk.yellow(`⚠ Config file already exists at ${configFile}`));
    }
    console.log(chalk.blue('PromptVault initialized successfully.'));
}
