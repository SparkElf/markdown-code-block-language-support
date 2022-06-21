// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import { commands, CompletionList, Disposable, ExtensionContext, languages, TabInputText, TextDocument, Uri, window, workspace } from 'vscode';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let disposes = [] as Disposable[]
//virtual documents : uri document-content
const vdocs = new Map<string, TextDocument>()
export function activate(context: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "markdown-code-block-language-support" is now active!');

    disposes.push(languages.registerCompletionItemProvider(
        { scheme: 'file', language: 'markdown' },
        {
            provideCompletionItems: async (doc, pos, token, ctx) => {
                const originalUriStr = Buffer.from(doc.uri.toString()).toString('base64')//清理? . 等对后续路径编码的影响
                //vscode based on electron so we need to encode uri in case of error , but the originalUri is already encoded by default , you can debug to confirm it
                const vdocUriStr = `mcbls://ts/${originalUriStr}.ts`
                vdocs.set(vdocUriStr, doc)
                const vdocUri = Uri.parse(vdocUriStr)
                const res = await commands.executeCommand<CompletionList>(
                    'vscode.executeCompletionItemProvider',
                    vdocUri,
                    pos,
                    ctx.triggerCharacter
                )
                console.log(workspace.textDocuments)
                console.log(res)
                return res
            }
        }
    ))
    workspace.registerTextDocumentContentProvider('mcbls', {
        provideTextDocumentContent(uri, token) {
            console.log(vdocs.get(uri.toString()).getText())
            return vdocs.get(uri.toString()).getText()
        },
    })
}

// this method is called when your extension is deactivated
export function deactivate() {
    //kill the listener
    disposes.forEach(v => v.dispose())
}
