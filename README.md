# MSApps OpenCode Plugins

> **If you find these plugins useful, please ⭐ star this repo** — it helps other developers discover the marketplace and motivates us to keep building!

**The largest open-source plugin marketplace for OpenCode.** 32+ production-ready plugins converted from the Claude plugin ecosystem — built on the SOSA™ security framework.

## 🚀 Quick Start

### OpenCode (CLI)

```bash
# 1. Add plugins to your opencode.json config
# Edit ~/.config/opencode/opencode.json or project's opencode.json:

{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-google-drive", "opencode-toggl-tracker"]
}

# 2. Or install from npm (if published)
npm install -g opencode-google-drive opencode-toggl-tracker

# 3. Just talk to OpenCode
# "Upload this file to Google Drive" / "Start tracking my time"
```

### OpenCode Desktop App

1. **Settings** → **Plugins** → **Add Local Plugin**
2. Point to `~/.config/opencode/plugins/` or project's `.opencode/plugins/`
3. Start talking — OpenCode uses the plugin automatically

---

## 📦 Available Plugins

### Productivity & Cloud
| Plugin | What it does | Install |
|--------|-------------|---------|
| **drive** | Upload files to Google Drive — unlimited, free | `opencode-drive` |
| **toggl-tracker** | Track time with Toggl — start/stop timers, reports | `opencode-toggl-tracker` |
| **session-backup** | Daily backups of sessions, skills & configs | `opencode-session-backup` |
| **mac-disk-cleaner** | Reclaim disk space on macOS — clean caches, find bloat | `opencode-mac-disk-cleaner` |

### Communication
| Plugin | What it does | Install |
|--------|-------------|---------|
| **whatsapp-mcp** | Connect OpenCode to WhatsApp — search, read, send | `opencode-whatsapp-mcp` |
| **x-content-intelligence** | Scrape X/Twitter for insights & generate content | `opencode-x-content-intelligence` |

### Development Tools
| Plugin | What it does | Install |
|--------|-------------|---------|
| **swift-lsp** | Real-time Swift code intelligence — diagnostics, go-to-definition | `opencode-swift-lsp` |
| **kotlin-lsp** | Real-time Kotlin code intelligence — diagnostics, hover types | `opencode-kotlin-lsp` |
| **md-composer** | Audit, compose, and refactor CLAUDE.md/AGENTS.md files | `opencode-md-composer` |

### Security & Compliance
| Plugin | What it does | Install |
|--------|-------------|---------|
| **sosa-compliance-checker** | Audit your entire plugin ecosystem against SOSA™ | `opencode-sosa-compliance-checker` |
| **sosa-governor** | Real-time SOSA governance — classifies, gates, logs MCP tool calls | `opencode-sosa-governor` |
| **sosa-orchestrator** | Token-aware task prioritization and budget management | `opencode-sosa-orchestrator` |
| **token-efficiency-audit** | Find and fix token waste — typical savings: 20-50% | `opencode-token-efficiency-audit` |

### AI & Memory
| Plugin | What it does | Install |
|--------|-------------|---------|
| **notion-memory** | Long-term memory in Notion + 4 Anthropic skills | `opencode-notion-memory` |
| **cowork-mem** | Persistent memory across OpenCode sessions | `opencode-cowork-mem` |
| **skill-campfire** | Turn your skills into characters who hang out around a campfire | `opencode-skill-campfire` |

### Web & Scraping
| Plugin | What it does | Install |
|--------|-------------|---------|
| **apify-scraper** | Full Apify web scraping — run Actors, manage datasets | `opencode-apify-scraper` |
| **youtube-transcriber** | Transcribe YouTube videos & playlists — no API key | `opencode-youtube-transcriber` |

### Infrastructure
| Plugin | What it does | Install |
|--------|-------------|---------|
| **gcloud-cli-health-check** | Scheduled health check for Google Cloud CLI | `opencode-gcloud-cli-health-check` |
| **github-cli-health-check** | Scheduled health check for GitHub CLI | `opencode-github-cli-health-check` |
| **vm-disk-cleanup** | Fix disk-full errors in VMs & sandboxes | `opencode-vm-disk-cleanup` |
| **fix-chrome-connection** | Fix stale OpenCode in Chrome connections | `opencode-fix-chrome-connection` |
| **cowork-session-fixer** | Fix stuck OpenCode sessions — automated 5-tier recovery | `opencode-cowork-session-fixer` |

### E-commerce
| Plugin | What it does | Install |
|--------|-------------|---------|
| **wordpress-mcp** | Manage WordPress — posts, users, WooCommerce | `opencode-wordpress-mcp` |
| **opsagent-shopify** | Shopify integration for OpsAgent ecosystem | `opencode-opsagent-shopify` |

### Other
| Plugin | What it does | Install |
|--------|-------------|---------|
| **apollo** | Prospect leads & enrich contacts with Apollo.io | `opencode-apollo` |
| **digital-presence** | Manage your digital presence across platforms | `opencode-digital-presence` |
| **rtl-chat** / **rtl-chat-fixer** | Fix jumbled RTL/LTR text mixing (Hebrew, Arabic) | `opencode-rtl-chat-fixer` |
| **zoho-mail-health** | Daily health check for Zoho Mail accounts | `opencode-zoho-mail-health` |
| **agents-md-optimizer** | Optimize AGENTS.md files for better AI performance | `opencode-agents-md-optimizer` |

---

## 🔧 Setup Guides

<details>
<summary><strong>Google Drive Upload</strong></summary>

One-time Google Apps Script deployment. Save your config to `~/.opencode-google-drive-config.json`:
```json
{
  "url": "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
  "apiKey": "your-api-key"
}
```
</details>

<details>
<summary><strong>Toggl Time Tracker</strong></summary>

Save your Toggl API token to `~/.opencode-toggl-config.json`:
```json
{
  "apiToken": "your-toggl-api-token",
  "workspaceId": 1234567
}
```
Get your token at [track.toggl.com/profile](https://track.toggl.com/profile).
</details>

<details>
<summary><strong>WhatsApp</strong></summary>

Requires the [WhatsApp MCP bridge](https://github.com/lharries/whatsapp-mcp):
```bash
brew install go uv ffmpeg
git clone https://github.com/lharries/whatsapp-mcp.git ~/whatsapp-mcp
cd ~/whatsapp-mcp/whatsapp-bridge && go build -o whatsapp-bridge && ./whatsapp-bridge
```
Scan the QR code with WhatsApp on first run.
</details>

<details>
<summary><strong>WordPress MCP</strong></summary>

Set environment variables after installing:

| Variable | Description |
|----------|-------------|
| `WP_MCP_URL` | Your site's MCP endpoint (`https://yoursite.com/wp-json/mcp/v1`) |
| `WP_MCP_AUTH` | Base64-encoded `username:application-password` |

Requires [WordPress MCP Adapter](https://developer.wordpress.org/news/2026/02/from-abilities-to-ai-agents-introducing-the-wordpress-mcp-adapter/) on WordPress 6.9+.
</details>

---

## 🛠️ Development

### Plugin Structure

```
plugins/
  {plugin-name}/
    index.js         # Main plugin file (OpenCode format)
    package.json    # Dependencies (if needed)
    README.md       # Documentation
    examples/       # Usage examples
```

### Creating a New Plugin

```javascript
// plugins/my-plugin/index.js
export const MyPlugin = async ({ project, client, $, directory, worktree }) => {
  console.log("Plugin initialized!")

  return {
    // Hook into events
    "tool.execute.before": async (input, output) => {
      // Modify tool behavior
    },
    
    // Add custom tools
    tool: {
      mytool: {
        description: "This is a custom tool",
        execute: async (args) => {
          return `Hello ${args.name}`
        }
      }
    },
    
    // Handle events
    event: async ({ event }) => {
      if (event.type === "session.created") {
        console.log("New session started!")
      }
    }
  }
}
```

---

## 🤝 Contributing

We welcome contributions! 

1. **Fork** this repo
2. **Create a branch** (`git checkout -b my-plugin`)
3. **Follow the SOSA framework** — your plugin should declare its compliance level
4. **Submit a PR** with a clear description

---

## ⭐ Star History

If this project is useful to you, consider giving it a ⭐ — it helps others discover these tools.

[![Star History Chart](https://api.star-history.com/svg?repos=MSApps-Mobile/opencode-plugins&type=Date)](https://star-history.com/#MSApps-Mobile/opencode-plugins&Date)

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/MSApps-Mobile/opencode-plugins/issues)
- **Email:** michal@msapps.mobi
- **Website:** [msapps.mobi](https://msapps.mobi)

---

<p align="center">
  Built by <a href="https://msapps.mobi">MSApps</a> · Powered by SOSA™
</p>
