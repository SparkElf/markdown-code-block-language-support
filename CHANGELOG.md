# Change Log

All notable changes to the "ts-for-markdown" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

- Initial release

## v1
- fix:确认ts的completion不起作用是因为禁用了builtin ts/js service
- feat:通过openTextDocument，打开一个对应语言的textdocument捕获completion信息，缺点是会打开一个新的标签页。
## v2
- feat:通过executeCompletionItemProvider注册一个虚拟文档，uri的后缀名为对应语言的后缀名，经过测试可以捕获对应语言的completion。