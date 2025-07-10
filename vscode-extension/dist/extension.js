"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const child_process_1 = require("child_process");
class PromptTreeItem {
    constructor(id, filePath) {
        this.id = id;
        this.filePath = filePath;
        this.collapsibleState = vscode.TreeItemCollapsibleState?.None ?? 0;
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
class PromptVaultProvider {
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
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
function activate(context) {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    const provider = new PromptVaultProvider(workspaceRoot);
    vscode.window.registerTreeDataProvider('promptVaultSidebar', provider);
    context.subscriptions.push(vscode.commands.registerCommand('promptvault.refresh', () => provider.refresh()), vscode.commands.registerCommand('promptvault.runPrompt', (item) => runPrompt(item)));
}
function runPrompt(item) {
    const output = vscode.window.createOutputChannel('PromptVault');
    output.show(true);
    const cmd = `pv test ${item.id}`;
    output.appendLine(`Running: ${cmd}`);
    const process = (0, child_process_1.exec)(cmd, { cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath });
    process.stdout?.on('data', (data) => output.append(data));
    process.stderr?.on('data', (data) => output.append(data));
    process.on('close', (code) => output.appendLine(`\nProcess exited with code ${code}`));
}
function deactivate() { }
