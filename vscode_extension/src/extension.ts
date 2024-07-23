// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import { UmdSubProjProvider } from './umdsubtree';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
	const nodeDependenciesProvider = new UmdSubProjProvider(rootPath);
	vscode.window.registerTreeDataProvider('umdsubmit', nodeDependenciesProvider);
	vscode.commands.registerCommand('umdsubmit.refreshEntry', () => nodeDependenciesProvider.refresh());
	vscode.commands.registerCommand('umdsubmit.submit', (path: string) => nodeDependenciesProvider.submit(path));

	// context.subscriptions.push(disposable);
}

export function submit(path: string) {

}

// This method is called when your extension is deactivated
export function deactivate() { }
