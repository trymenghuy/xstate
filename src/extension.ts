"use strict";

import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

let lastSelectedFolder: string | undefined;

function toPascalCase(input: string): string {
  return input
    .replace(/[\W_]+/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}
function generateFileContent(className: string): string {
  return `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class ${className} extends StatelessWidget {

  const ${className}({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AppProvider(
      provider: ${className}Provider(),
      onReady: (p) {
        p.onStart(add);
      },
      child: Consumer<${className}Provider>(builder: (_, provider, __) {
        return provider.widget.build(
          
            builder: (data) {
              return Scaffold(
              );
            });
      }),
    );
  }
}`;
}
function generateProviderFileContent(className: string): string {
  return `import 'package:flutter/material.dart';

class ${className}Provider with ChangeNotifier {
  AppState<dynamic> _widget = AppState();
  AppState<dynamic> get widget => _widget;
  void _setState(AppState<dynamic> state) {
    _widget = state;
    notifyListeners();
  }
  void get() async {
    
  }
}`;
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
        defaultUri: lastSelectedFolder
          ? vscode.Uri.file(lastSelectedFolder)
          : undefined,
        openLabel: "Select Folder",
      });

      if (!folderUri || folderUri.length === 0) {
        vscode.window.showErrorMessage("No folder selected");
        return;
      }

      lastSelectedFolder = folderUri[0].fsPath;

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

      const filePath = path.join(lastSelectedFolder, fileName);
      const providerFilePath = path.join(
        lastSelectedFolder,
        "provider",
        providerFileName
      );

      // Check if the file already exists
      if (fs.existsSync(filePath) || fs.existsSync(providerFilePath)) {
        vscode.window.showErrorMessage("Files already exist");
        return;
      }

      // Create the main file
      fs.writeFileSync(filePath, generateFileContent(className));

      // Create the provider file in the 'provider' folder
      const providerFolder = path.join(lastSelectedFolder, "provider");
      if (!fs.existsSync(providerFolder)) {
        fs.mkdirSync(providerFolder);
      }

      fs.writeFileSync(
        providerFilePath,
        generateProviderFileContent(className)
      );

      vscode.window.showInformationMessage(
        `Files ${fileName} and ${providerFileName} generated successfully`
      );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
