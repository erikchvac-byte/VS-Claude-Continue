# CLAUDE.md Continue Sync

Auto-syncs `CLAUDE.md` files to Continue extension rules, enabling Claude Code-style project instructions in VS Code's Continue extension.

## How It Works

This extension watches for `CLAUDE.md` files and automatically converts them to Continue-compatible rule files in `.continue/rules/`.

**File Priority (merged in order):**
1. `~/.claude/CLAUDE.md` - Global rules
2. `./CLAUDE.md` - Project root rules  
3. `./CLAUDE.local.md` - Local/personal rules (gitignored)

## Installation

### Option 1: Install from VSIX (Recommended)
```bash
cd claude-md-continue-sync
npm install
npm run compile
npx @vscode/vsce package
code --install-extension claude-md-continue-sync-1.0.0.vsix
```

### Option 2: Development Mode
```bash
cd claude-md-continue-sync
npm install
npm run compile
# Press F5 in VS Code to launch Extension Development Host
```

## Usage

1. Create a `CLAUDE.md` file in your project root
2. The extension auto-syncs it to `.continue/rules/00-claude-md.md`
3. Continue extension picks up the rules automatically

### Manual Sync
- Command Palette: `Sync CLAUDE.md to Continue Rules`

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `claudeMdSync.autoSync` | `true` | Auto-sync on file changes |
| `claudeMdSync.includeGlobal` | `true` | Include `~/.claude/CLAUDE.md` |
| `claudeMdSync.rulePrefix` | `00-claude-md` | Rule file prefix (controls load order) |

## Example CLAUDE.md

```markdown
# Project Guidelines

- Use TypeScript strict mode
- Follow ESLint rules
- Write tests for all new functions
- Use functional components in React
- Keep functions under 50 lines
```

## Compatibility

- Works alongside Claude Code (both read the same `CLAUDE.md`)
- Continue extension v0.9+ required
- VS Code 1.85+
