import { CodeActionProvider, CodeActionKind, Range, CodeAction, TextDocument, DocumentFilter, CodeActionContext, Diagnostic, window } from "vscode";
import * as vs from "vscode";

interface CommandInput {
    name: string;
    range: Range;
}

export class InsertActionProvider implements CodeActionProvider {
    readonly actionName = "r_flutter.insert";
    readonly filter: DocumentFilter = { language: "dart", scheme: "file" };
    readonly className = 'StringsBinding';
    readonly regex = RegExp(`^The getter \'(.*)\' isn\'t defined for the class \'${this.className}\'.`);

    extractName(context: CodeActionContext): [string, Diagnostic] | null {
        for (const obj of context.diagnostics) {
            if (obj.code === "undefined_getter") {
                const result = this.regex.exec(obj.message);
                if (result && result.length === 2) {
                    return [result[1], obj];
                }
            }
        }

        return null;
    }
    provideCodeActions(document: TextDocument, range: Range, context: CodeActionContext): CodeAction[] {
        const result = this.extractName(context);
        if (result) {
            const action = new CodeAction("I18n: add localization string", CodeActionKind.QuickFix);
            const input: CommandInput = {
                name: result[0],
                range: range
            };

            action.command = {
                title: action.title,
                command: this.actionName,
                arguments: [
                    input
                ]
            };
            action.diagnostics = [result[1]];
            action.isPreferred = true;
            return [action];
        }
        return [];
    }

    async insertAsync(input: CommandInput): Promise<void> {
        try {
            await this.insertAsyncThrowing(input);
        } catch (error) {
            console.log(error);
            window.showErrorMessage(error.message);
        }
    }

    async insertAsyncThrowing(input: CommandInput): Promise<void> {
        const key = input.name;

        const value = await window.showInputBox({
            prompt: "Please enter key for the new localization value",
            placeHolder: "Value"
        });

        if (!key || !value) {
            window.showInformationMessage(`Adding key was cancelled.`);
            return;
        }

        await this.addEntryToDefaultLocale(key, value);
    }

    async addEntryToDefaultLocale(key: string, value: string): Promise<void> {
        let root = vs.workspace.workspaceFolders![0];
        let pubspecPath = root.uri.path + '/pubspec.yaml';
        
        //vs.commands.executeCommand("workbench.action.reloadWindow");
    }
}
