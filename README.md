# Mustache Template Generator

VS Code extension that provides IntelliSense and autocomplete for Mustache template fields based on a project JSON schema.

## Features

- Autocomplete for Mustache variables
- Suggestions based on template-schema.json
- Supports nested fields (header.title, section.content, etc.)

## Usage

1. Create a file named `template-schema.json` in your project root.
2. Start typing inside `{{ }}` in a `.mustache` file.
3. Suggestions will appear automatically.

## Example Schema

```json
{
  "header": {
    "title": "",
    "logo": ""
  }
}
