import * as vs from "vscode";
import * as cp from 'child_process';

import { InsertActionProvider } from "./InsertActionProvider";

export function activate(context: vs.ExtensionContext) {
    const subscriptions = context.subscriptions;
    const provider = new InsertActionProvider();

    subscriptions.push(vs.languages.registerCodeActionsProvider(provider.filter, provider));

    subscriptions.push(vs.commands.registerCommand(provider.actionName, (input) => {
        provider.insertAsync(input);
    }));

    subscriptions.push(vs.commands.registerCommand("r_flutter.runRegenerate", runRegenerate));
    subscriptions.push(vs.commands.registerCommand("r_flutter.runFileCheck", () => provider.runFileCheck()));
}

function runRegenerate() {
    let command = vs.workspace.getConfiguration('r_flutter').get<String>("shellCommand")!;

    let root = vs.workspace.workspaceFolders![0].uri;
    cp.exec(command.toString(), { cwd: root.fsPath }, (err, stdout, stderr) => {
        if (err != null) {
            vs.window.showErrorMessage(`Failed to regenerate: ${err}`);
        } else {
            vs.window.showInformationMessage('File regenerated.');
        }
    });
}

export function deactivate() { }
