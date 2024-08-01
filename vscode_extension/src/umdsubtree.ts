import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class UmdSubProjProvider implements vscode.TreeDataProvider<Project> {

    private _onDidChangeTreeData: vscode.EventEmitter<| Project | undefined | void> = new vscode.EventEmitter<Project | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<| Project | undefined | void> = this._onDidChangeTreeData.event;

    constructor(private workspaceRoot: string | undefined) {
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: Project): vscode.TreeItem {
        return element;
    }

    getChildren(element?: Project) {
        if (!this.workspaceRoot) {
            vscode.window.showInformationMessage('No dependency in empty workspace');
            return Promise.resolve([]);
        }

        if (!element) {
            vscode.window.showInformationMessage('here');
            return Promise.resolve(this.findSubmitFiles());
        }
        // return Promise.resolve([]);
    }

    /**
     * Given the path to package.json, read all its dependencies and devDependencies.
     */
    private async findSubmitFiles() {
        const workspaceRoot = this.workspaceRoot;
        console.log(workspaceRoot);
        let res: Project[] = [];
        let paths = await vscode.workspace.findFiles("**/.submit");
        paths.forEach(element => {
            // console.log(element);
            res.push(new Project(element.fsPath, vscode.TreeItemCollapsibleState.None, {
                command: 'umdsubmit.submit',
                title: '',
                arguments: [element.fsPath.split("/.sub")[0]]
            }));
        });
        res.sort();
        return res;
    }

    submit(path: string) {
        console.log(path);
    }


}

export class Project extends vscode.TreeItem {

    constructor(
        public readonly path: string,
        // private readonly version: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        let label = "oops";
        let contents = fs.readFileSync(path, 'utf8').split(/[\r\n]+/);
        // console.log(contents);
        for (const line of contents) {
            if (line.includes("projectNumber")) {
                label = line.split('=')[1];
            }
        }
        super(label, collapsibleState);

        this.description = `${contents[1].split("Course")[1]}-${contents[2].substring(10)}`;
        // this.description = contents;
        this.command = command;
    }

    // iconPath = {
    //     light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
    //     dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
    // };

    // contextValue = 'dependency';
}