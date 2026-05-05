#!/bin/bash

# batch-convert.sh
# Batch convert all Claude plugins to OpenCode format

set -e

CLAUDE_PLUGINS_DIR="/Users/michalshatz/Documents/Claude/claude-plugins/plugins"
OPENCODE_PLUGINS_DIR="/Users/michalshatz/Documents/Claude/opencode-plugins/plugins"

echo "Starting batch conversion of Claude plugins to OpenCode format..."
echo "Source: $CLAUDE_PLUGINS_DIR"
echo "Destination: $OPENCODE_PLUGINS_DIR"
echo ""

# List of plugins to convert (excluding ones already done)
PLUGINS=(
  "agents-md-optimizer"
  "apify-scraper"
  "apollo"
  "claude-md-composer"
  "cowork-mem"
  "cowork-session-fixer"
  "digital-presence"
  "fix-chrome-connection"
  "gcloud-cli-health-check"
  "github-cli-health-check"
  "kotlin-lsp"
  "linkedin-scraper"
  "mac-disk-cleaner"
  "notion-memory"
  "opsagent-shopify"
  "rtl-chat"
  "rtl-chat-fixer"
  "session-backup"
  "skill-campfire"
  "sosa-compliance-checker"
  "sosa-governor"
  "sosa-orchestrator"
  "swift-lsp"
  "token-efficiency-audit"
  "vm-disk-cleanup"
  "whatsapp-mcp"
  "wordpress-mcp"
  "x-content-intelligence"
  "zoho-mail-health"
)

# Function to convert plugin name
convert_name() {
  echo "$1" | sed 's/claude-/opencode-/g' | sed 's/-upload//g' | sed 's/-tracker/-tracker/g' | sed 's/-transcriber/-transcriber/g'
}

# Convert each plugin
for plugin in "${PLUGINS[@]}"; do
  echo "Converting: $plugin"
  
  # Define OpenCode plugin name
  OPENCODE_NAME=$(convert_name "$plugin")
  OPENCODE_DIR_NAME=$(echo "$OPENCODE_NAME" | sed 's/opencode-//g')
  
  # Create destination directory
  DEST_DIR="$OPENCODE_PLUGINS_DIR/$OPENCODE_DIR_NAME"
  mkdir -p "$DEST_DIR"
  
  # Check if SKILL.md exists
  SKILL_FILE="$CLAUDE_PLUGINS_DIR/$plugin/SKILL.md"
  if [ -f "$SKILL_FILE" ]; then
    echo "  Found SKILL.md, converting..."
    
    # Create a basic OpenCode plugin structure
    cat > "$DEST_DIR/index.js" <<EOF
/**
 * OpenCode Plugin: $OPENCODE_NAME
 * 
 * Converted from Claude plugin: $plugin
 * Original: MSApps Claude Plugins
 */

export const $(echo ${plugin//-/ } | awk '{for(i=1;i<=NF;i++){$i=toupper(substr($i,1,1)) substr($i,2)}}1')Plugin = async ({ project, client, \$, directory, worktree }) => {
  console.log("$plugin plugin initialized!")

  return {
    // Tool definitions - converted from SKILL.md
    tool: {
      // Add tools based on original plugin functionality
    },

    // Event hooks
    event: async ({ event }) => {
      if (event.type === "session.created") {
        console.log("$plugin plugin ready")
      }
    },

    // Log plugin initialization
    "session.created": async (input, output) => {
      await client.app.log({
        body: {
          service: "$plugin",
          level: "info",
          message: "$plugin plugin loaded",
          extra: { directory }
        }
      })
    }
  }
}

/*
Original SKILL.md content for reference:
$(cat "$SKILL_FILE")
*/
EOF

    # Create package.json
    cat > "$DEST_DIR/package.json" <<EOF
{
  "name": "$OPENCODE_NAME",
  "version": "1.0.0",
  "description": "Converted from Claude plugin: $plugin. OpenCode plugin.",
  "main": "index.js",
  "keywords": ["opencode", "plugin", "$(echo $plugin | sed 's/-/ /g')"],
  "author": "MSApps <michal@msapps.mobi>",
  "license": "MIT",
  "opencode": {
    "plugin": true,
    "compatibility": ["opencode"],
    "sosa": {
      "compliance": "full",
      "level": "supervised"
    }
  }
}
EOF

    echo "  ✓ Created $DEST_DIR"
  else
    echo "  ✗ SKILL.md not found, skipping..."
  fi
  
  echo ""
done

echo "Batch conversion complete!"
echo ""
echo "Next steps:"
echo "1. Review converted plugins in $OPENCODE_PLUGINS_DIR"
echo "2. Customize each plugin's index.js with proper tool definitions"
echo "3. Test plugins with OpenCode"
echo "4. Commit and push to GitHub"
