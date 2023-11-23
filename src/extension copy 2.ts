"use strict";

import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

// function toPascalCase(input: string): string {
//   return input
//     .replace(/(?:^\w|[A-Z]|\b\w)/g, (match, index) => {
//       return index === 0 ? match.toUpperCase() : match.toLowerCase();
//     })
//     .replace(/\s+/g, "");
// }
// function toPascalCase(input: string): string {
//   return input
//     .replace(/(?:^\w|[A-Z]|\b\w|\b\d)/g, (match, index) => {
//       return index === 0 ? match.toUpperCase() : match.toLowerCase();
//     })
//     .replace(/[\s_]+/g, "");
// }
function toPascalCase(input: string): string {
  return input
    .replace(/[\W_]+/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.trymenghuyDartState ",
    async () => {
      // Prompt user to select a folder
      const folderUri = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: "Select Folder",
      });

      if (!folderUri || folderUri.length === 0) {
        vscode.window.showErrorMessage("No folder selected");
        return;
      }

      const selectedFolder = folderUri[0].fsPath;

      // Prompt user to enter file name
      const inputName = await vscode.window.showInputBox({
        prompt: "Enter file name (without extension)",
      });

      if (!inputName) {
        vscode.window.showErrorMessage("File name cannot be empty");
        return;
      }

      // Convert input name to PascalCase
      const className = toPascalCase(inputName);

      const fileName = `${inputName}.dart`;
      const providerFileName = `${inputName}_provider.dart`;

      const filePath = path.join(selectedFolder, fileName);
      const providerFilePath = path.join(
        selectedFolder,
        "provider",
        providerFileName
      );

      // Check if the file already exists
      if (fs.existsSync(filePath) || fs.existsSync(providerFilePath)) {
        vscode.window.showErrorMessage("Files already exist");
        return;
      }

      // Create the main file
      fs.writeFileSync(filePath, `class ${className} {}`);

      // Create the provider file in the 'provider' folder
      const providerFolder = path.join(selectedFolder, "provider");
      if (!fs.existsSync(providerFolder)) {
        fs.mkdirSync(providerFolder);
      }

      fs.writeFileSync(providerFilePath, `class ${className}Provider {}`);

      vscode.window.showInformationMessage(
        `Files ${fileName} and ${providerFileName} generated successfully`
      );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
