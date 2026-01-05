# CLAUDE.md Continue Sync Extension - Development Instructions

## Project Overview

This VS Code extension automatically syncs CLAUDE.md instruction files to the Continue extension's rules directory, enabling seamless AI assistant configuration across different AI tools.

**Status**: ✅ Auto-sync is working! Last tested: 2026-01-05

## Purpose

The extension bridges the gap between:
- **Claude Code**: Uses `CLAUDE.md` and `.claude/instructions.md` files for project instructions
- **Continue Extension**: Uses `.continue/rules/*.md` files for AI assistant instructions

By automatically syncing these files, developers can maintain a single source of truth for AI instructions that works with both tools.

## Architecture

### Core Components

1. **File Watchers** ([extension.ts:48-79](src/extension.ts#L48-L79))
   - Monitors `CLAUDE.md` and `CLAUDE.local.md` files in workspace
   - Monitors `.claude/instructions.md` files (modern convention)
   - Monitors global `~/.claude/CLAUDE.md` file
   - Triggers sync on create, change, and delete events

2. **Sync Engine** ([extension.ts:97-179](src/extension.ts#L97-L179))
   - Collects content from multiple sources in priority order:
     1. Global `~/.claude/CLAUDE.md` (if enabled)
     2. Workspace root `CLAUDE.md`
     3. Workspace `CLAUDE.local.md`
     4. Workspace `.claude/instructions.md`
   - Generates Continue-compatible rule file in `.continue/rules/`
   - Handles cleanup when source files are deleted

3. **Configuration** ([package.json:30-49](package.json#L30-L49))
   - `autoSync`: Enable/disable automatic syncing (default: true)
   - `includeGlobal`: Include global ~/.claude/CLAUDE.md (default: true)
   - `rulePrefix`: Prefix for Continue rule file (default: "00-claude-md")

### File Priority & Merging

Files are merged in this order (later files override earlier ones):
```
~/.claude/CLAUDE.md (global, optional)
  ↓
CLAUDE.md (workspace root)
  ↓
CLAUDE.local.md (workspace, gitignored personal rules)
  ↓
.claude/instructions.md (modern convention)
```

### Output Format

Generated file: `.continue/rules/00-claude-md.md`
```markdown
---
name: CLAUDE.md Project Rules
alwaysApply: true
description: Auto-synced rules from CLAUDE.md files (Claude Code compatibility)
---

# Global CLAUDE.md Rules
[content from ~/.claude/CLAUDE.md]

---

# Project CLAUDE.md Rules
[content from CLAUDE.md]

---

# Local CLAUDE.md Rules
[content from CLAUDE.local.md]

---

# Claude Instructions
[content from .claude/instructions.md]
```

## Development Guidelines

### Code Quality Standards

- **TypeScript Strict Mode**: All code must compile with strict mode enabled
- **Error Handling**: Gracefully handle file system errors, show user-friendly messages
- **Logging**: Use `console.log` for debug info, `console.error` for errors
- **Performance**: Debounce file watching to avoid excessive syncs

### Testing Strategy

1. **Manual Testing Checklist**:
   - [ ] Extension activates when CLAUDE.md exists
   - [ ] Extension activates when .claude/instructions.md exists
   - [ ] File watcher triggers on CLAUDE.md changes
   - [ ] File watcher triggers on .claude/instructions.md changes
   - [ ] Sync command works manually
   - [ ] Multiple workspace folders handled correctly
   - [ ] Global ~/.claude/CLAUDE.md included when enabled
   - [ ] Configuration changes apply without reload
   - [ ] Rule file removed when all sources deleted

2. **Test Scenarios**:
   - Create/modify/delete CLAUDE.md files
   - Create/modify/delete .claude/instructions.md files
   - Toggle configuration settings
   - Multiple workspace folders with different files
   - Missing .continue/rules directory (should create)
   - File permission errors (should show error message)

### File Watching Patterns

The extension uses three separate watchers:
```typescript
// Workspace CLAUDE files
'**/CLAUDE*.md'  // Matches CLAUDE.md, CLAUDE.local.md, etc.

// Modern convention
'**/.claude/instructions.md'

// Global file
path.join(os.homedir(), '.claude', 'CLAUDE.md')
```

### Extension Lifecycle

1. **Activation** ([extension.ts:9-46](src/extension.ts#L9-L46))
   - Triggers on workspace open if CLAUDE files present
   - Triggers on startup finished
   - Performs initial sync immediately
   - Sets up file watchers if autoSync enabled

2. **File Change Events**
   - All watchers call `syncAllClaudeMdFiles()`
   - Sync collects content from all sources
   - Generates merged rule file
   - Writes to `.continue/rules/`

3. **Deactivation** ([extension.ts:208-210](src/extension.ts#L208-L210))
   - Disposes all file watchers
   - Cleanup subscriptions

## Common Development Tasks

### Adding New File Sources

To support a new instruction file format:

1. Add file watcher in `setupFileWatcher()`
2. Add file reading logic in `syncClaudeMdForWorkspace()`
3. Update activation events in `package.json`
4. Update documentation

### Modifying Sync Priority

Change the order of file reading in `syncClaudeMdForWorkspace()` to adjust priority.

### Debugging

Enable output channel:
```typescript
const outputChannel = vscode.window.createOutputChannel('CLAUDE.md Sync');
outputChannel.appendLine('Debug message');
```

View logs:
- VS Code Developer Tools: Help → Toggle Developer Tools → Console
- Look for "CLAUDE.md Continue Sync activated" message

### Building & Testing

```bash
# Compile TypeScript
npm run compile

# Watch mode during development
npm run watch

# Package extension
npm run package

# Install locally for testing
code --install-extension claude-md-continue-sync-1.0.0.vsix
```

## Known Limitations

1. **No validation**: Extension doesn't validate markdown syntax
2. **No conflict resolution**: Last file wins in merge
3. **No diff tracking**: Full sync on any change
4. **Single Continue instance**: Assumes one Continue config per workspace

## Future Enhancements

- [ ] Add option to validate markdown syntax before sync
- [ ] Support custom merge strategies
- [ ] Add diff detection to avoid unnecessary writes
- [ ] Support `.clauderc` JSON configuration files
- [ ] Add status bar indicator for sync status
- [ ] Support for nested workspace folders
- [ ] Conflict detection between different source files

## Dependencies

- VS Code API: ^1.85.0
- Node.js fs/path modules for file operations
- No external npm dependencies (keeps extension lightweight)

## Security Considerations

- File system access limited to workspace and ~/.claude/
- No network requests
- No external code execution
- File watching uses VS Code's safe FileSystemWatcher API

## Best Practices for Contributors

1. **Read before modifying**: Always read existing code patterns
2. **Test manually**: Extension requires manual testing with real files
3. **Error messages**: Make them actionable for users
4. **Configuration**: Provide sensible defaults, make everything optional
5. **Documentation**: Update this file when changing architecture
6. **Backwards compatibility**: Don't break existing CLAUDE.md setups

## Related Files

- [extension.ts](src/extension.ts) - Main extension logic
- [package.json](package.json) - Extension manifest and configuration
- [CLAUDE.md](CLAUDE.md) - Legacy project rules (kept for compatibility)
- [README.md](README.md) - User-facing documentation
- [HANDOFF.md](HANDOFF.md) - Detailed implementation notes

## Support

For issues, bugs, or feature requests, please file an issue with:
- VS Code version
- Extension version
- Steps to reproduce
- Expected vs actual behavior
- Relevant file structure
