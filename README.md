# MSApps OpenCode Plugins

> **If you find these plugins useful, please ⭐ star this repo** — it helps other developers discover the marketplace and motivates us to keep building!

**The largest open-source plugin marketplace for OpenCode.** 35+ production-ready plugins converted from the Claude plugin ecosystem — built on the SOSA™ security framework.

## Quick Start

### OpenCode (CLI)

```bash
# 1. Add plugins to your opencode.json config
# Edit ~/.config/opencode/opencode.json or project's opencode.json:

{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-google-drive", "opencode-toggl-tracker"]
}

# 2. Or install from npm
npm install -g opencode-google-drive opencode-toggl-tracker

# 3. Just talk to OpenCode
# "Upload this file to Google Drive" / "Start tracking my time"
```

### OpenCode Desktop App

1. **Settings** → **Plugins** → **Add Local Plugin**
2. Point to `~/.config/opencode/plugins/` or project's `.opencode/plugins/`
3. Start talking — OpenCode uses the plugin automatically

---

## Available Plugins

| Plugin | What it does | Install |
|--------|-------------|---------|
| **google-drive** | Upload files to Google Drive — unlimited, free | `opencode-google-drive` |
| **toggl-tracker** | Track time with Toggl — start/stop timers, reports | `opencode-toggl-tracker` |
| **youtube-transcriber** | Transcribe YouTube videos & playlists — no API key | `opencode-youtube` |
| **notion-memory** | Long-term memory in Notion + 4 Anthropic skills | `opencode-notion-memory` |
| **whatsapp** | Connect OpenCode to WhatsApp — search, read, send | `opencode-whatsapp` |
| **wordpress** | Manage WordPress — posts, users, WooCommerce | `opencode-wordpress` |
| **apollo** | Prospect leads & enrich contacts with Apollo.io | `opencode-apollo` |
| **session-backup** | Daily backups of sessions, skills & configs | `opencode-session-backup` |

*(Full list of 35+ plugins below)*

---

## Plugin Categories

### Productivity & Cloud
- google-drive
- toggl-tracker
- session-backup
- mac-disk-cleaner

### Communication
- whatsapp
- x-content-intelligence

### Development Tools
- swift-lsp
- kotlin-lsp
- claude-md-composer (now opencode-md-composer)

### Security & Compliance
- sosa-compliance-checker
- sosa-governor
- sosa-orchestrator
- token-efficiency-audit

### AI & Memory
- notion-memory
- cowork-mem (now opencode-mem)
- skill-campfire

### Web & Scraping
- apify-scraper
- youtube-transcriber
- x-content-intelligence

### Infrastructure
- gcloud-cli-health-check
- github-cli-health-check
- vm-disk-cleanup
- fix-chrome-connection
- cowork-session-fixer

### E-commerce
- wordpress
- opsagent-shopify

---

## Setup Guides

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

---

## Development

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

## Contributing

We welcome contributions! 

1. **Fork** this repo
2. **Create a branch** (`git checkout -b my-plugin`)
3. **Follow the SOSA framework** — your plugin should declare its compliance level
4. **Submit a PR** with a clear description

---

## Star History

If this project is useful to you, consider giving it a ⭐ — it helps others discover these tools.

[![Star History Chart](https://api.star-history.com/svg?repos=MSApps-Mobile/opencode-plugins&type=Date)](https://star-history.com/#MSApps-Mobile/opencode-plugins&Date)

---

## Support

- **Issues:** [GitHub Issues](https://github.com/MSApps-Mobile/opencode-plugins/issues)
- **Email:** michal@msapps.mobi
- **Website:** [msapps.mobi](https://msapps.mobi)

---

<p align="center">
  Built by <a href="https://msapps.mobi">MSApps</a> · Powered by SOSA™
</p>
