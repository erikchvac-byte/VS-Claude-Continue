# CLAUDE.md Continue Sync

[![VS Code Extension](https://img.shields.io/badge/VS%20Code-Extension-blue)](https://github.com/erikchvac-byte/VS-Claude-Continue)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Auto-syncs `CLAUDE.md` files to Continue extension rules, enabling Claude Code-style project instructions in VS Code's Continue extension.

## 🎯 What Problem Does This Solve?

If you use both **Claude Code CLI** and **Continue extension** in VS Code, you've probably noticed they use different configuration formats:
- Claude Code uses `CLAUDE.md` files for project instructions
- Continue uses `.continue/rules/*.md` files with YAML frontmatter

This extension **bridges that gap** by automatically syncing your `CLAUDE.md` files to Continue's format, so you can maintain one set of project rules that work with both tools.

## ✨ Features

- 🔄 **Automatic Synchronization** - Watches for changes to CLAUDE.md files and syncs instantly
- 📁 **Multi-Level Rules** - Merges global, project, and local rules in priority order
- 🎯 **File Watching** - Monitors CLAUDE.md, CLAUDE.local.md, .claude/instructions.md, and ~/.claude/CLAUDE.md
- 🆕 **Modern Convention Support** - Full support for `.claude/instructions.md` files
- ⚙️ **Configurable** - Control auto-sync, global inclusion, and file naming
- 🛡️ **Error Handling** - Graceful error recovery with user-friendly messages
- 🔌 **Zero Dependencies** - Uses only VS Code and Node.js built-in APIs

## 📦 Installation

### Quick Install from VSIX
```bash
code --install-extension claude-md-continue-sync-1.0.0.vsix
```

### Build from Source
```bash
git clone https://github.com/erikchvac-byte/VS-Claude-Continue.git
cd VS-Claude-Continue
npm install
npm run compile
npx @vscode/vsce package
code --install-extension claude-md-continue-sync-1.0.0.vsix
```

## 🚀 Quick Start

See [QUICKSTART.md](QUICKSTART.md) for a step-by-step guide.

**TL;DR:**
1. Install the extension
2. Create a `CLAUDE.md` file in your project root
3. The extension automatically creates `.continue/rules/00-claude-md.md`
4. Continue extension picks up your rules!

## 📖 How It Works

This extension watches for `CLAUDE.md` files and automatically converts them to Continue-compatible rule files in `.continue/rules/`.

### File Priority (merged in order)

Rules are merged from multiple sources in this priority order:

1. **`~/.claude/CLAUDE.md`** - Global rules (applies to all projects)
2. **`./CLAUDE.md`** - Project root rules (project-specific, legacy format)
3. **`./CLAUDE.local.md`** - Local/personal rules (gitignored, developer-specific)
4. **`./.claude/instructions.md`** - Modern convention (recommended for new projects)

Each file is clearly labeled in the merged output so you can see where rules came from.

### File Watching

The extension watches all four locations and triggers automatic sync when any file changes:
- ✅ Workspace `CLAUDE.md` and `CLAUDE.local.md` files (legacy format)
- ✅ Workspace `.claude/instructions.md` file (modern convention)
- ✅ Global `~/.claude/CLAUDE.md` file
- ✅ Auto-sync can be disabled via settings

## 🎮 Usage

### Basic Usage

1. **Create a CLAUDE.md file** in your project root:
   ```markdown
   # Project Guidelines

   - Use TypeScript strict mode
   - Write tests for all new functions
   - Follow ESLint rules
   ```

2. **Extension auto-syncs** to `.continue/rules/00-claude-md.md`:
   ```yaml
   ---
   name: CLAUDE.md Project Rules
   alwaysApply: true
   description: Auto-synced rules from CLAUDE.md files (Claude Code compatibility)
   ---

   # Project CLAUDE.md Rules

   # Project Guidelines

   - Use TypeScript strict mode
   - Write tests for all new functions
   - Follow ESLint rules
   ```

3. **Continue extension** automatically loads these rules!

### Manual Sync

Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) and run:
- **`Sync CLAUDE.md to Continue Rules`** - Sync current workspace
- **`Sync All CLAUDE.md Files`** - Sync all workspace folders

### Global Rules

Create `~/.claude/CLAUDE.md` for rules that apply to all your projects:

```markdown
# Global Development Standards

- Always use meaningful variable names
- Comment complex logic
- Keep functions under 50 lines
```

These rules will be included in every project (can be disabled via settings).

### Local Rules (Personal Overrides)

Create `CLAUDE.local.md` in your project for personal preferences that shouldn't be committed:

```markdown
# My Personal Preferences

- Use 2-space indentation
- Prefer async/await over promises
```

Add to `.gitignore`:
```
CLAUDE.local.md
```

## ⚙️ Settings

Configure the extension via VS Code settings (`Ctrl+,` or `Cmd+,`):

| Setting | Default | Description |
|---------|---------|-------------|
| `claudeMdSync.autoSync` | `true` | Automatically sync CLAUDE.md files on changes |
| `claudeMdSync.includeGlobal` | `true` | Include global `~/.claude/CLAUDE.md` in sync |
| `claudeMdSync.rulePrefix` | `00-claude-md` | Rule file prefix (controls Continue load order) |

### Example settings.json

```json
{
  "claudeMdSync.autoSync": true,
  "claudeMdSync.includeGlobal": true,
  "claudeMdSync.rulePrefix": "00-claude-md"
}
```

## 📝 Example CLAUDE.md Files

### For a React Project
```markdown
# React Project Guidelines

## Component Structure
- Use functional components with hooks
- Keep components under 200 lines
- One component per file

## State Management
- Use React Context for global state
- Prefer local state when possible
- No prop drilling beyond 2 levels

## Testing
- Write unit tests for all utilities
- Integration tests for user flows
- 80% code coverage minimum

## Styling
- Use CSS Modules
- Follow BEM naming convention
- Mobile-first responsive design
```

### For a Backend API
```markdown
# API Development Guidelines

## Code Quality
- TypeScript strict mode enabled
- ESLint and Prettier configured
- No `any` types allowed

## API Design
- RESTful endpoints
- Versioned APIs (v1, v2, etc.)
- Proper HTTP status codes

## Security
- Validate all inputs
- Sanitize database queries
- Rate limiting on all endpoints
- JWT authentication required

## Testing
- Jest for unit tests
- Supertest for API tests
- Mock external services
```

## 🔧 Development

### Project Structure
```
claude-md-continue-sync/
├── src/
│   └── extension.ts          # Main extension code
├── .claude/
│   └── instructions.md       # Development instructions (modern convention)
├── .continue/
│   └── rules/
│       └── 00-claude-md.md   # Auto-generated Continue rules
├── .vscode/
│   ├── launch.json           # Debug configuration
│   └── tasks.json            # Build tasks
├── package.json              # Extension manifest
├── tsconfig.json             # TypeScript config
├── CLAUDE.md                 # Legacy project rules
├── README.md                 # This file
├── HANDOFF.md               # Project handoff documentation
└── QUICKSTART.md            # Quick start guide
```

### Building

```bash
npm install          # Install dependencies
npm run compile      # Compile TypeScript
npm run watch        # Watch mode for development
```

### Testing

Press `F5` in VS Code to launch the Extension Development Host for testing.

### Packaging

```bash
npx @vscode/vsce package
```

Creates `claude-md-continue-sync-1.0.0.vsix`

## 🆕 What's New in v1.0.0

This release includes major enhancements and bug fixes:

1. **✅ Modern Convention Support** - Full support for `.claude/instructions.md` files (recommended format)
2. **✅ CLAUDE.local.md File Watching** - Now watches `CLAUDE.local.md` for changes (previously only watched `CLAUDE.md`)
3. **✅ Global File Watching** - Added watcher for `~/.claude/CLAUDE.md` (previously only read on activation)
4. **✅ Comprehensive Instructions** - Added detailed `.claude/instructions.md` for extension development
5. **✅ Error Handling** - Comprehensive try/catch blocks prevent crashes on file permission errors

## 🤝 Compatibility

- **VS Code**: 1.85.0 or higher
- **Continue Extension**: v0.9+ (uses YAML frontmatter format)
- **Claude Code**: Works alongside - both tools read the same `CLAUDE.md` files
- **Platform**: Windows, macOS, Linux

## 📄 License

MIT License - See LICENSE file for details

## 🙋 Support

- **Issues**: [GitHub Issues](https://github.com/erikchvac-byte/VS-Claude-Continue/issues)
- **Documentation**: See [HANDOFF.md](HANDOFF.md) for technical details
- **Quick Start**: See [QUICKSTART.md](QUICKSTART.md) for getting started

## 🤖 Credits

Built with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5
