const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
	const attributesDir = path.join(__dirname, 'attributes');

	const provider = vscode.languages.registerCompletionItemProvider(
		{ language: 'json', scheme: 'file' },
		{
			provideCompletionItems(document, position) {
				const fullText = document.getText();
				const lineText = document.lineAt(position).text;
				const textBeforeCursor = lineText.substring(0, position.character);

				const prefix = textBeforeCursor.replace(/["'\s]/g, '').toLowerCase();
				const suggestions = [];

				// Scan all JSON files in attributes/
				const files = fs.readdirSync(attributesDir).filter(f => f.endsWith('.json'));

				for (const file of files) {
					const attrName = path.basename(file, '.json'); // e.g. "size", "color"
					const filePath = path.join(attributesDir, file);
					const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

					// Only suggest if attribute not already present and prefix matches filename
					if (!fullText.includes(`"${attrName}"`) && prefix.startsWith(attrName.substring(0, 2))) {
						const completion = new vscode.CompletionItem(attrName, vscode.CompletionItemKind.Property);

						// Build dropdown from values
						const values = data.map(item => item.value).join(',');
						completion.insertText = new vscode.SnippetString(
							`${attrName}": "\${1|${values}|}`
						);

						// Show descriptions in IntelliSense 
						const docs = data.map(item => `- **${item.value}**: ${item.description}`).join('\n');
						completion.documentation = new vscode.MarkdownString(`Options for ${attrName}:\n${docs}`);
						// Customize label (optional: show first value + description) 
						completion.detail = `Attribute: ${attrName}`;
						completion.label = `${attrName} (choose value)`;
						suggestions.push(completion);
					}
				}

				return suggestions;
			}
		},
		...'abcdefghijklmnopqrstuvwxyz'.split('')
	);

	context.subscriptions.push(provider);
}

function deactivate() { }

module.exports = { activate, deactivate };
