import { createConnection, TextDocumentSyncKind, TextDocuments, CompletionItemKind } from 'vscode-languageserver/node'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { CompletionItem } from 'vscode'
const connection = createConnection()
//文档管理器，通过把纯字符串内容实例化为文档可以获得诸如光标等的文档访问服务
//这个文档管理器设置为一个基础的接口，可以接入用户自定义的文档模型，这里使用vscode提供的基础文档模型
const documents = new TextDocuments(TextDocument)
//服务器和客户端连接前要先建立一次握手，进行一些初始化的协商，这里通过capabilities字段，服务器告诉客户端可以提供哪些服务
connection.onInitialize(params => {
    return {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Full,
            //https://github.com/microsoft/language-server-protocol/issues/830 这里澄清一下，服务器必须注册一个对象形式的completionProvider选项，客户端才可以使用 provideCompletionItem 接口，即便服务器返回的是空内容
            completionProvider: {
                resolveProvider: false //返回空内容
            }
        }
    }
})
connection.onInitialized(() => {
    connection.window.showInformationMessage('markdown intellisense all in one server launched')
})
/* connection.onCompletion(async (params) => {
    return [new CompletionItem('hello', CompletionItemKind.Field)]
}) */
connection.listen()
//文档管理器被设置为响应式设计模式，可以根据文本内容的变化自动生成新的文档
documents.listen(connection)