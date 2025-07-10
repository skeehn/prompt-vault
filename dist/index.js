import { Command } from 'commander';
import { initVault } from './modules/init.js';
import { addPrompt } from './modules/add.js';
import { listPrompts } from './modules/list.js';
import { lintVault } from './modules/lint.js';
import { testPrompt } from './modules/test.js';
import { diffPrompts } from './modules/diff.js';
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
program
    .command('test <id>')
    .description('Test a prompt against a model')
    .option('-m, --model <model>', 'Model to use', 'gpt-3.5-turbo')
    .action(async (id, options) => {
    await testPrompt(id, options.model);
});
program
    .command('diff <id1> <id2>')
    .description('Show diff between two prompt versions')
    .action((id1, id2) => {
    diffPrompts(id1, id2);
});
program.parse(process.argv);
