import {
    commands,
    window,
    ExtensionContext,
    languages,
} from "vscode";


import { InsertActionProvider } from "./InsertActionProvider";

export function activate(context: ExtensionContext) {
    const subscriptions = context.subscriptions;
    const provider = new InsertActionProvider();

    subscriptions.push(languages.registerCodeActionsProvider(provider.filter, provider));

    subscriptions.push(commands.registerCommand(provider.actionName, (input) => {
        provider.insertAsync(input);
    }));
}

export function deactivate() { }
