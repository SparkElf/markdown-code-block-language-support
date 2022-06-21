// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import { CompletionItem, CompletionItemKind, CompletionList, Disposable, ExtensionContext, languages } from 'vscode';
import { LanguageClientOptions, LanguageClient, ServerOptions, TransportKind } from 'vscode-languageclient/node'
import { commands, window } from 'vscode';
import * as path from 'path'
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
let client: LanguageClient
let dispose: () => any
export function activate(context: ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "markdown-code-block-language-support" is now active!');
	// The server is implemented in node
	const serverModule = context.asAbsolutePath(path.join('out', 'server.js'));
	// The debug options for the server
	// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
	const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};


	const clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: 'file', language: 'markdown' }],
		middleware: {
			provideCompletionItem(document, position, context, token, next) {
				console.log(context.triggerCharacter)
				return [{ label: 'findArray', kind: CompletionItemKind.Function }]
			},
		}
	}

	client = new LanguageClient(
		'markdown-code-block-language-support',
		'markdown code block language support',
		//根据LSP协议，每个服务器唯一地服务一个客户端实例，每个客户端也必须唯一地实例化一个服务器，它们是一对一的，所以对于请求转发，我们也必须实例化一个假服务器，它的功能仅仅是客户端发送文档到服务器，服务器再原样返回文档到客户端
		serverOptions,
		clientOptions
	)
	client.start()
	dispose = languages.registerCompletionItemProvider(
		{ scheme: 'file', language: 'markdown' },
		{
			provideCompletionItems: (doc, pos, token, ctx) => {

				return commands.executeCommand<CompletionList>(
					'vscode.executeCompletionItemProvider',

				)
			}
		}
	).dispose
}

// this method is called when your extension is deactivated
export function deactivate() {
	if (!client) return undefined
	//kill the listener
	dispose()
	return client.stop()
}
