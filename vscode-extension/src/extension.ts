import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';

class PromptTreeItem implements vscode.TreeItem {
  label: string;
  collapsibleState = (vscode as any).TreeItemCollapsibleState?.None ?? 0;
  tooltip?: string;
  contextValue?: string;
  command?: vscode.Command;

  constructor(public readonly id: string, public readonly filePath: string) {
    this.label = id;
    this.tooltip = filePath;
    this.contextValue = 'promptItem';
    this.command = {
      command: 'promptvault.runPrompt',
      title: 'Run Prompt',
      arguments: [this],
    };
  }
}

class PromptVaultProvider implements vscode.TreeDataProvider<PromptTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<PromptTreeItem | undefined | void> = new vscode.EventEmitter<PromptTreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<PromptTreeItem | undefined | void> = this._onDidChangeTreeData.event;

  constructor(private readonly workspaceRoot: string | undefined) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: PromptTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: PromptTreeItem): Thenable<PromptTreeItem[]> {
    if (!this.workspaceRoot) {
      return Promise.resolve([]);
    }
    const vaultDir = path.join(this.workspaceRoot, 'vault');
    if (!fs.existsSync(vaultDir)) {
      return Promise.resolve([]);
    }
    const files = fs.readdirSync(vaultDir).filter((f) => f.endsWith('.pv.md'));
    const items = files.map((file) => {
      const filePath = path.join(vaultDir, file);
      const id = file.replace('.pv.md', '');
      return new PromptTreeItem(id, filePath);
    });
    return Promise.resolve(items);
  }
}

export function activate(context: vscode.ExtensionContext): void {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  const provider = new PromptVaultProvider(workspaceRoot);
  vscode.window.registerTreeDataProvider('promptVaultSidebar', provider);

  context.subscriptions.push(
    vscode.commands.registerCommand('promptvault.refresh', () => provider.refresh()),
    vscode.commands.registerCommand('promptvault.runPrompt', (item: PromptTreeItem) => runPrompt(item))
  );
}

function runPrompt(item: PromptTreeItem): void {
  const output = vscode.window.createOutputChannel('PromptVault');
  output.show(true);
  const cmd = `pv test ${item.id}`;
  output.appendLine(`Running: ${cmd}`);
  const process = exec(cmd, { cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath });
  process.stdout?.on('data', (data) => output.append(data));
  process.stderr?.on('data', (data) => output.append(data));
  process.on('close', (code) => output.appendLine(`\nProcess exited with code ${code}`));
}

export function deactivate(): void {}