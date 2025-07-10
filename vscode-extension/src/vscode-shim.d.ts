// Re-export minimal VSCode API types for compilation in sandbox environment

declare type Thenable<T> = Promise<T>;

declare module 'vscode' {
  export interface Command {
    command: string;
    title: string;
    arguments?: any[];
  }

  export interface TreeItem {
    label: string;
    collapsibleState?: any;
    tooltip?: string;
    contextValue?: string;
    command?: Command;
  }

  export const TreeItemCollapsibleState: {
    None: number;
    Collapsed: number;
    Expanded: number;
  };

  export interface Event<T> {}

  export class EventEmitter<T> {
    event: Event<T>;
    fire(data?: T | undefined): void;
  }

  export interface TreeDataProvider<T> {
    getTreeItem(element: T): TreeItem | Thenable<TreeItem>;
    getChildren(element?: T): Thenable<T[]>;
  }

  export namespace window {
    function registerTreeDataProvider(viewId: string, provider: TreeDataProvider<any>): void;
    function createOutputChannel(name: string): {
      append(value: string): void;
      appendLine(value: string): void;
      show(preserveFocus?: boolean): void;
    };
  }

  export namespace commands {
    function registerCommand(command: string, callback: (...args: any[]) => any): any;
  }

  export namespace workspace {
    const rootPath: string | undefined;
    const workspaceFolders: { uri: { fsPath: string } }[] | undefined;
  }

  export interface ExtensionContext {
    subscriptions: { dispose(): any }[];
  }
}