import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "kubernetesapply" is now active!');

	function runResourceCommand(command: string, uri: vscode.Uri | undefined) {
		if (uri === undefined && vscode.window.activeTextEditor === undefined) {
			return;
		}

		let resourcePath = '';
		if (uri !== undefined) {
			resourcePath = uri.fsPath;
		}
		else if (vscode.window.activeTextEditor !== undefined) {
			const currentlyOpenTabfilePath = vscode.window.activeTextEditor.document.fileName;
			resourcePath = path.basename(currentlyOpenTabfilePath);
		}
	 
		if (!ensureTerminalExists()) {
			return;
		}

		const terminal = selectTerminal();
		terminal.sendText(`kubectl ${command} -f ${resourcePath}`);
	}

	let disposableCreate = vscode.commands.registerCommand('kubernetesapply.create', (uri:vscode.Uri) => {
		runResourceCommand('create', uri);
	});

	let disposableApply = vscode.commands.registerCommand('kubernetesapply.apply', (uri:vscode.Uri) => {
		runResourceCommand('apply', uri);
	});

	let disposableDelete = vscode.commands.registerCommand('kubernetesapply.delete', (uri:vscode.Uri) => {
		runResourceCommand('delete', uri);
	});

	context.subscriptions.push(disposableCreate);
	context.subscriptions.push(disposableApply);
	context.subscriptions.push(disposableDelete);
}

export function deactivate() {}

function ensureTerminalExists(): boolean {
	if ((<any>vscode.window).terminals.length === 0) {
		vscode.window.showErrorMessage('No active terminals');
		return false;
	}
	return true;
}

function selectTerminal(): vscode.Terminal {
	return <vscode.Terminal>(<any>vscode.window.activeTerminal);
}