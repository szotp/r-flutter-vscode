import * as vs from "vscode";


import { InsertActionProvider } from "./InsertActionProvider";

export function activate(context: vs.ExtensionContext) {
    const subscriptions = context.subscriptions;
    const provider = new InsertActionProvider();

    subscriptions.push(vs.languages.registerCodeActionsProvider(provider.filter, provider));

    subscriptions.push(vs.commands.registerCommand(provider.actionName, (input) => {
        provider.insertAsync(input);
    }));
}

export function deactivate() { }
