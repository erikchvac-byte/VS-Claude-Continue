import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

let fileWatcher: vscode.FileSystemWatcher | undefined;
let instructionsWatcher: vscode.FileSystemWatcher | undefined;
let globalFileWatcher: vscode.FileSystemWatcher | undefined;

export function activate(context: vscode.ExtensionContext) {
    console.log('CLAUDE.md Continue Sync activated');

    // Initial sync on activation
    syncAllClaudeMdFiles();

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('claudeMdSync.sync', () => {
            syncAllClaudeMdFiles();
            vscode.window.showInformationMessage('CLAUDE.md synced to Continue rules');
        }),
        vscode.commands.registerCommand('claudeMdSync.syncAll', () => {
            syncAllClaudeMdFiles();
            vscode.window.showInformationMessage('All CLAUDE.md files synced');
        })
    );

    // Set up file watcher for CLAUDE.md changes
    const config = vscode.workspace.getConfiguration('claudeMdSync');
    if (config.get<boolean>('autoSync', true)) {
        setupFileWatcher(context);
    }

    // Watch for config changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('claudeMdSync.autoSync')) {
                const newConfig = vscode.workspace.getConfiguration('claudeMdSync');
                if (newConfig.get<boolean>('autoSync', true)) {
                    setupFileWatcher(context);
                } else {
                    disposeFileWatcher();
                }
            }
        })
    );
}

function setupFileWatcher(context: vscode.ExtensionContext) {
    disposeFileWatcher();

    // Watch for CLAUDE.md and CLAUDE.local.md in all workspace folders
    fileWatcher = vscode.workspace.createFileSystemWatcher('**/CLAUDE*.md');

    fileWatcher.onDidChange(() => syncAllClaudeMdFiles());
    fileWatcher.onDidCreate(() => syncAllClaudeMdFiles());
    fileWatcher.onDidDelete(() => syncAllClaudeMdFiles());

    context.subscriptions.push(fileWatcher);

    // Watch for .claude/instructions.md files
    instructionsWatcher = vscode.workspace.createFileSystemWatcher('**/.claude/instructions.md');

    instructionsWatcher.onDidChange(() => syncAllClaudeMdFiles());
    instructionsWatcher.onDidCreate(() => syncAllClaudeMdFiles());
    instructionsWatcher.onDidDelete(() => syncAllClaudeMdFiles());

    context.subscriptions.push(instructionsWatcher);

    // Watch for global ~/.claude/CLAUDE.md
    const globalClaudeMdPath = path.join(os.homedir(), '.claude', 'CLAUDE.md');
    globalFileWatcher = vscode.workspace.createFileSystemWatcher(globalClaudeMdPath);

    globalFileWatcher.onDidChange(() => syncAllClaudeMdFiles());
    globalFileWatcher.onDidCreate(() => syncAllClaudeMdFiles());
    globalFileWatcher.onDidDelete(() => syncAllClaudeMdFiles());

    context.subscriptions.push(globalFileWatcher);
}

function disposeFileWatcher() {
    if (fileWatcher) {
        fileWatcher.dispose();
        fileWatcher = undefined;
    }
    if (instructionsWatcher) {
        instructionsWatcher.dispose();
        instructionsWatcher = undefined;
    }
    if (globalFileWatcher) {
        globalFileWatcher.dispose();
        globalFileWatcher = undefined;
    }
}

async function syncAllClaudeMdFiles() {
    const config = vscode.workspace.getConfiguration('claudeMdSync');
    const rulePrefix = config.get<string>('rulePrefix', '00-claude-md');
    const includeGlobal = config.get<boolean>('includeGlobal', true);
    
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return;
    }

    for (const folder of workspaceFolders) {
        await syncClaudeMdForWorkspace(folder.uri.fsPath, rulePrefix, includeGlobal);
    }
}

async function syncClaudeMdForWorkspace(
    workspacePath: string,
    rulePrefix: string,
    includeGlobal: boolean
) {
    try {
        const continueRulesPath = path.join(workspacePath, '.continue', 'rules');

        // Ensure .continue/rules directory exists
        if (!fs.existsSync(continueRulesPath)) {
            try {
                fs.mkdirSync(continueRulesPath, { recursive: true });
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to create .continue/rules directory: ${error}`);
                return;
            }
        }

        // Collect all CLAUDE.md content
        const claudeContent: string[] = [];

        // 1. Global ~/.claude/CLAUDE.md
        if (includeGlobal) {
            const globalClaudeMd = path.join(os.homedir(), '.claude', 'CLAUDE.md');
            if (fs.existsSync(globalClaudeMd)) {
                try {
                    const content = fs.readFileSync(globalClaudeMd, 'utf-8');
                    claudeContent.push(`# Global CLAUDE.md Rules\n\n${content}`);
                } catch (error) {
                    console.error(`Failed to read global CLAUDE.md: ${error}`);
                }
            }
        }

        // 2. Workspace root CLAUDE.md
        const workspaceClaudeMd = path.join(workspacePath, 'CLAUDE.md');
        if (fs.existsSync(workspaceClaudeMd)) {
            try {
                const content = fs.readFileSync(workspaceClaudeMd, 'utf-8');
                claudeContent.push(`# Project CLAUDE.md Rules\n\n${content}`);
            } catch (error) {
                console.error(`Failed to read workspace CLAUDE.md: ${error}`);
            }
        }

        // 3. Look for nested CLAUDE.md files (CLAUDE.local.md pattern)
        const localClaudeMd = path.join(workspacePath, 'CLAUDE.local.md');
        if (fs.existsSync(localClaudeMd)) {
            try {
                const content = fs.readFileSync(localClaudeMd, 'utf-8');
                claudeContent.push(`# Local CLAUDE.md Rules\n\n${content}`);
            } catch (error) {
                console.error(`Failed to read CLAUDE.local.md: ${error}`);
            }
        }

        // 4. Look for .claude/instructions.md (modern convention)
        const claudeInstructions = path.join(workspacePath, '.claude', 'instructions.md');
        if (fs.existsSync(claudeInstructions)) {
            try {
                const content = fs.readFileSync(claudeInstructions, 'utf-8');
                claudeContent.push(`# Claude Instructions\n\n${content}`);
            } catch (error) {
                console.error(`Failed to read .claude/instructions.md: ${error}`);
            }
        }

        // Generate Continue rule file
        if (claudeContent.length > 0) {
            const ruleContent = generateContinueRule(claudeContent.join('\n\n---\n\n'));
            const ruleFile = path.join(continueRulesPath, `${rulePrefix}.md`);
            try {
                fs.writeFileSync(ruleFile, ruleContent, 'utf-8');
                console.log(`Synced CLAUDE.md to ${ruleFile}`);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to write Continue rule file: ${error}`);
            }
        } else {
            // Remove rule file if no CLAUDE.md exists
            const ruleFile = path.join(continueRulesPath, `${rulePrefix}.md`);
            if (fs.existsSync(ruleFile)) {
                try {
                    fs.unlinkSync(ruleFile);
                    console.log(`Removed ${ruleFile} (no CLAUDE.md found)`);
                } catch (error) {
                    console.error(`Failed to remove rule file: ${error}`);
                }
            }
        }
    } catch (error) {
        vscode.window.showErrorMessage(`CLAUDE.md sync error: ${error}`);
        console.error('Sync error:', error);
    }
}

function generateContinueRule(content: string): string {
    return `---
name: CLAUDE.md Project Rules
alwaysApply: true
description: Auto-synced rules from CLAUDE.md files (Claude Code compatibility)
---

${content}
`;
}

export function deactivate() {
    disposeFileWatcher();
}

