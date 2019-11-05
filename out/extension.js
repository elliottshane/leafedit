"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fileSystemProvider_1 = require("./fileSystemProvider");
var rp = require('request-promise');
function activate(context) {
    const leafFS = new fileSystemProvider_1.LeafFS();
    context.subscriptions.push(vscode.workspace.registerFileSystemProvider('leaffs', leafFS, { isCaseSensitive: true }));
    let initialized = false;
    context.subscriptions.push(vscode.commands.registerCommand('leaffs.reset', _ => {
        for (const [name] of leafFS.readDirectory(vscode.Uri.parse('leaffs:/'))) {
            leafFS.delete(vscode.Uri.parse(`leaffs:/${name}`));
        }
        initialized = false;
    }));
    context.subscriptions.push(vscode.commands.registerCommand('leaffs.addFile', _ => {
        if (initialized) {
            leafFS.writeFile(vscode.Uri.parse(`leaffs:/file.txt`), Buffer.from('foo'), { create: true, overwrite: true });
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('leaffs.deleteFile', _ => {
        if (initialized) {
            leafFS.delete(vscode.Uri.parse('leaffs:/file.txt'));
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('leaffs.init', _ => {
        if (initialized) {
            return;
        }
        initialized = true;
        var options = {
            method: 'GET',
            uri: 'http://localhost/~shane/leaf/leaf_request_portal/api/system/reportTemplates',
        };
        rp(options)
            .then(function (data) {
            // POST succeeded...
            console.log(data);
            leafFS.writeFile(vscode.Uri.parse(`leaffs:/leafProgrammer/file.json`), Buffer.from(data), { create: true, overwrite: true });
        })
            .catch(function (err) {
            console.log(err);
            // POST failed...
        });
        console.log('setting up directories');
        leafFS.createDirectory(vscode.Uri.parse(`leaffs:/templates/`));
        leafFS.createDirectory(vscode.Uri.parse(`leaffs:/leafProgrammer/`));
        leafFS.writeFile(vscode.Uri.parse(`leaffs:/leafProgrammer/file.html`), Buffer.from('<html><body><h1 class="hd">Hello</h1></body></html>'), { create: true, overwrite: true });
        leafFS.writeFile(vscode.Uri.parse(`leaffs:/templates/file.html`), Buffer.from('<html><body><h1 class="hd">Hello</h1></body></html>'), { create: true, overwrite: true });
    }));
    context.subscriptions.push(vscode.commands.registerCommand('leaffs.workspaceInit', _ => {
        vscode.workspace.updateWorkspaceFolders(0, 0, { uri: vscode.Uri.parse('leaffs:/'), name: "Leaf" });
    }));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map