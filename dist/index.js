import { Command } from 'commander';
import { initVault } from './modules/init.js';
import { addPrompt } from './modules/add.js';
import { listPrompts } from './modules/list.js';
import { lintVault } from './modules/lint.js';
const program = new Command();
program
    .name('pv')
    .description('PromptVault CLI (MVP)')
    .version('0.1.0');
program
    .command('init [path]')
    .description('Initialize a new prompt vault')
    .action((pathArg) => {
    initVault(pathArg || process.cwd());
});
program
    .command('add <prompt>')
    .description('Add a new prompt to the vault')
    .option('-t, --tags <tags>', 'Comma separated tags', '')
    .action((prompt, options) => {
    const tags = options.tags.split(',').map((t) => t.trim()).filter(Boolean);
    addPrompt(prompt, tags);
});
program
    .command('list')
    .description('List prompts in the vault')
    .action(() => {
    listPrompts();
});
program
    .command('lint')
    .description('Lint prompts in the vault')
    .action(() => {
    lintVault();
});
program.parse(process.argv);
