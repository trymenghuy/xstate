// "use strict";

// import * as vscode from "vscode";
// import * as fs from "fs";
// import * as path from "path";

// export function activate(context: vscode.ExtensionContext) {
//   let disposable = vscode.commands.registerCommand(
//     "extension.trymenghuyDartState ",
//     async () => {
//       const inputName = await vscode.window.showInputBox({
//         prompt: "Enter file name (without extension)",
//       });

//       if (!inputName) {
//         vscode.window.showErrorMessage("File name cannot be empty");
//         return;
//       }

//       const fileName = `${inputName}.dart`;
//       const providerFileName = `${inputName}_provider.dart`;

//       // Get the first workspace folder (assuming there is at least one)
//       const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

//       if (!rootPath) {
//         vscode.window.showErrorMessage("No Flutter project found");
//         return;
//       }

//       const filePath = path.join(rootPath, fileName);
//       const providerFilePath = path.join(
//         rootPath,
//         "provider",
//         providerFileName
//       );

//       // Check if the file already exists
//       if (fs.existsSync(filePath) || fs.existsSync(providerFilePath)) {
//         vscode.window.showErrorMessage("Files already exist");
//         return;
//       }

//       // Create the main file
//       fs.writeFileSync(filePath, `class ${inputName} {}`);

//       // Create the provider file in the 'provider' folder
//       const providerFolder = path.join(rootPath, "provider");
//       if (!fs.existsSync(providerFolder)) {
//         fs.mkdirSync(providerFolder);
//       }

//       fs.writeFileSync(providerFilePath, `class ${inputName}Provider {}`);

//       vscode.window.showInformationMessage(
//         `Files ${fileName} and ${providerFileName} generated successfully`
//       );
//     }
//   );

//   context.subscriptions.push(disposable);
// }

// export function deactivate() {}
