# QUICKSTART.md - CLAUDE.md Continue Sync

Get up and running with CLAUDE.md Continue Sync in 5 minutes!

---

## 📋 Prerequisites

Before you start, make sure you have:

- ✅ **VS Code 1.85.0+** installed
- ✅ **Continue extension** installed (optional but recommended)
- ✅ Basic familiarity with VS Code and markdown

---

## 🚀 Installation

### Option 1: Install Pre-Built VSIX (Fastest)

If you have the `.vsix` file:

```bash
code --install-extension claude-md-continue-sync-1.0.0.vsix
```

**That's it!** Skip to [First Use](#-first-use)

### Option 2: Build from Source

If you want to build it yourself:

```bash
# Clone the repository
git clone https://github.com/erikchvac-byte/VS-Claude-Continue.git
cd VS-Claude-Continue

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Package extension
npx @vscode/vsce package

# Install the packaged extension
code --install-extension claude-md-continue-sync-1.0.0.vsix
```

### Verify Installation

1. Open VS Code
2. Go to **View → Extensions** (or press `Ctrl+Shift+X`)
3. Search for "CLAUDE.md Continue Sync"
4. You should see it in the "Installed" section

---

## 🎯 First Use

### Step 1: Create a CLAUDE.md File

Open any workspace in VS Code and create a file called `CLAUDE.md` in the root:

**Example CLAUDE.md:**
```markdown
# My Project Guidelines

## Code Style
- Use TypeScript strict mode
- Follow ESLint rules
- Keep functions under 50 lines

## Testing
- Write unit tests for all new functions
- Aim for 80% code coverage
- Use Jest for testing

## Documentation
- Document all public APIs
- Include code examples
- Keep comments up to date
```

**💾 Save the file**

### Step 2: Verify Sync Happened

Check your workspace for a new directory:

```
your-project/
├── CLAUDE.md                    # Your file
└── .continue/
    └── rules/
        └── 00-claude-md.md      # Auto-generated!
```

**Open `.continue/rules/00-claude-md.md`** and you should see:

```yaml
---
name: CLAUDE.md Project Rules
alwaysApply: true
description: Auto-synced rules from CLAUDE.md files (Claude Code compatibility)
---

# Project CLAUDE.md Rules

# My Project Guidelines

## Code Style
- Use TypeScript strict mode
- Follow ESLint rules
- Keep functions under 50 lines

## Testing
- Write unit tests for all new functions
- Aim for 80% code coverage
- Use Jest for testing

## Documentation
- Document all public APIs
- Include code examples
- Keep comments up to date
```

✅ **Success!** Your CLAUDE.md is now synced to Continue's format.

### Step 3: Test Auto-Sync

1. **Edit your CLAUDE.md file** - Add a new line:
   ```markdown
   - Always use meaningful variable names
   ```

2. **Save the file** (`Ctrl+S`)

3. **Check `.continue/rules/00-claude-md.md` again** - It should update automatically!

---

## 🌍 Using Global Rules

Want rules that apply to ALL your projects?

### Create Global CLAUDE.md

**Windows:**
```bash
mkdir C:\Users\YourUsername\.claude
notepad C:\Users\YourUsername\.claude\CLAUDE.md
```

**macOS/Linux:**
```bash
mkdir -p ~/.claude
nano ~/.claude/CLAUDE.md
```

**Example Global CLAUDE.md:**
```markdown
# My Global Development Standards

- Always use meaningful variable names
- Write self-documenting code
- Comment complex logic
- Test edge cases
- Keep functions pure when possible
```

### Verify Global Rules Are Included

Open any workspace and check `.continue/rules/00-claude-md.md`:

```yaml
---
name: CLAUDE.md Project Rules
alwaysApply: true
description: Auto-synced rules from CLAUDE.md files (Claude Code compatibility)
---

# Global CLAUDE.md Rules

# My Global Development Standards

- Always use meaningful variable names
- Write self-documenting code
- Comment complex logic
- Test edge cases
- Keep functions pure when possible

---

# Project CLAUDE.md Rules

# My Project Guidelines
...
```

✅ **Global rules appear first!**

---

## 🔒 Using Local Rules (Personal Preferences)

Want project-specific rules that don't get committed to git?

### Step 1: Create CLAUDE.local.md

In your project root:

```bash
# Create the file
touch CLAUDE.local.md

# Add to .gitignore
echo "CLAUDE.local.md" >> .gitignore
```

**Example CLAUDE.local.md:**
```markdown
# My Personal Preferences

- I prefer 2-space indentation
- I like to use async/await over promises
- I add debug logs during development
```

### Step 2: Verify It Merged

Check `.continue/rules/00-claude-md.md`:

```yaml
---
name: CLAUDE.md Project Rules
alwaysApply: true
description: Auto-synced rules from CLAUDE.md files (Claude Code compatibility)
---

# Global CLAUDE.md Rules
...

---

# Project CLAUDE.md Rules
...

---

# Local CLAUDE.md Rules

# My Personal Preferences

- I prefer 2-space indentation
- I like to use async/await over promises
- I add debug logs during development
```

✅ **Your personal rules are included but not committed to git!**

---

## 🎮 Manual Sync

Sometimes you might want to manually trigger a sync:

### Using Command Palette

1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type: **"Sync CLAUDE.md"**
3. Select: **"Sync CLAUDE.md to Continue Rules"**

You'll see a confirmation message: **"CLAUDE.md synced to Continue rules"**

### When to Use Manual Sync

- If auto-sync is disabled in settings
- To force a refresh after editing multiple files
- To verify the extension is working

---

## ⚙️ Configuration

### Accessing Settings

1. Open VS Code Settings: `Ctrl+,` (or `Cmd+,` on Mac)
2. Search for: **"CLAUDE.md Sync"**

### Available Settings

| Setting | Default | What It Does |
|---------|---------|--------------|
| **Auto Sync** | ✅ Enabled | Automatically sync when files change |
| **Include Global** | ✅ Enabled | Include `~/.claude/CLAUDE.md` in sync |
| **Rule Prefix** | `00-claude-md` | Filename prefix for Continue rules |

### Example: Disable Global Rules

If you don't want global rules included:

1. Open Settings (`Ctrl+,`)
2. Search: **"claudeMdSync.includeGlobal"**
3. Uncheck the box
4. Global rules will no longer be synced

### Example: Change Rule File Name

If you want the Continue rule file to be named differently:

1. Open Settings (`Ctrl+,`)
2. Search: **"claudeMdSync.rulePrefix"**
3. Change from `00-claude-md` to something like `01-my-rules`
4. The rule file will be `.continue/rules/01-my-rules.md`

**Why change the prefix?** The `00-` prefix ensures it loads first. If you have multiple rule files, you can control the order with different prefixes (`00-`, `01-`, `02-`, etc.)

---

## 🔍 Troubleshooting

### Extension Not Working?

**Check if the extension is installed:**
1. Go to **View → Extensions** (`Ctrl+Shift+X`)
2. Search: "CLAUDE.md Continue Sync"
3. Make sure it's installed and enabled

**Reload VS Code:**
1. Press `Ctrl+Shift+P`
2. Type: **"Reload Window"**
3. Select: **"Developer: Reload Window"**

### Files Not Syncing?

**Check auto-sync is enabled:**
1. Open Settings (`Ctrl+,`)
2. Search: **"claudeMdSync.autoSync"**
3. Make sure it's checked

**Manually trigger sync:**
1. Press `Ctrl+Shift+P`
2. Run: **"Sync CLAUDE.md to Continue Rules"**

**Check the output panel:**
1. Go to **View → Output**
2. Select **"Extension Host"** from the dropdown
3. Look for messages like "Synced CLAUDE.md to..."

### .continue Folder Not Created?

**Make sure you have a workspace open:**
- The extension only works when a folder is open in VS Code
- File → Open Folder to open a workspace

**Check file permissions:**
- Make sure you have write permissions in the workspace folder
- Try creating a file manually to test permissions

---

## 💡 Tips & Best Practices

### 🎯 Organizing Your Rules

**Use headings to organize rules:**
```markdown
# Project Guidelines

## Code Style
- Use TypeScript strict mode
- Follow ESLint rules

## Testing
- Write unit tests
- Aim for 80% coverage

## Security
- Validate all inputs
- Sanitize database queries
```

### 🌍 Global vs Project Rules

**Global Rules (`~/.claude/CLAUDE.md`):**
- Use for universal standards that apply to ALL projects
- Examples: naming conventions, general best practices

**Project Rules (`CLAUDE.md`):**
- Use for project-specific requirements
- Examples: framework choices, project architecture

**Local Rules (`CLAUDE.local.md`):**
- Use for personal preferences that shouldn't be shared
- Add to `.gitignore`
- Examples: debugging preferences, personal code style

### 🔄 Working with Teams

**Commit CLAUDE.md to git:**
```bash
git add CLAUDE.md
git commit -m "Add project coding guidelines"
git push
```

**Don't commit CLAUDE.local.md:**
```bash
# Add to .gitignore
echo "CLAUDE.local.md" >> .gitignore
```

**Team members automatically get rules:**
- When they clone the repo, CLAUDE.md is included
- Extension syncs rules automatically
- Everyone follows the same guidelines!

---

## 🎓 Next Steps

### Use with Continue Extension

If you have Continue extension installed:

1. The synced rules automatically appear in Continue's context
2. Continue will follow your CLAUDE.md guidelines
3. Try asking Continue to write code - it should follow your rules!

### Use with Claude Code CLI

This extension is compatible with Claude Code:

```bash
# Claude Code also reads CLAUDE.md
claude code "write a function"

# Your rules are respected by both tools!
```

### Customize for Your Project

**For a React project:**
```markdown
# React Project Guidelines

- Use functional components with hooks
- Keep components under 200 lines
- Use CSS Modules for styling
- Write PropTypes for all components
```

**For a Node.js API:**
```markdown
# API Development Guidelines

- Use Express.js
- RESTful endpoint design
- JWT authentication required
- Validate all inputs with Joi
```

---

## 📚 Learn More

- **Full Documentation**: See [README.md](README.md)
- **Technical Details**: See [HANDOFF.md](HANDOFF.md)
- **Report Issues**: [GitHub Issues](https://github.com/erikchvac-byte/VS-Claude-Continue/issues)

---

## ✅ Quick Reference

### File Locations

```
~/.claude/CLAUDE.md              # Global rules (all projects)
./CLAUDE.md                      # Project rules (this project)
./CLAUDE.local.md                # Personal rules (not committed)
./.continue/rules/00-claude-md.md # Generated output
```

### Commands

| Command | Shortcut | What It Does |
|---------|----------|--------------|
| Sync CLAUDE.md | `Ctrl+Shift+P` → Type "Sync CLAUDE" | Force sync now |
| Open Settings | `Ctrl+,` | Configure extension |
| Reload Window | `Ctrl+Shift+P` → "Reload Window" | Restart VS Code |

### Priority Order

Rules are merged in this order (later rules override earlier ones):
1. Global (`~/.claude/CLAUDE.md`)
2. Project (`./CLAUDE.md`)
3. Local (`./CLAUDE.local.md`)

---

**That's it! You're ready to use CLAUDE.md Continue Sync!** 🎉

If you have questions, check the [README.md](README.md) or open an issue on GitHub.
