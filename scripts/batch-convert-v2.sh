#!/bin/bash

# batch-convert-v2.sh
# Batch convert all Claude plugins to OpenCode format
# Handles nested skills/ directory structure

set -e

CLAUDE_PLUGINS_DIR="/Users/michalshatz/Documents/Claude/claude-plugins/plugins"
OPENCODE_PLUGINS_DIR="/Users/michalshatz/Documents/Claude/opencode-plugins/plugins"

echo "Starting batch conversion of Claude plugins to OpenCode format..."
echo "Source: $CLAUDE_PLUGINS_DIR"
echo "Destination: $OPENCODE_PLUGINS_DIR"
echo ""

# Find all SKILL.md files
find "$CLAUDE_PLUGINS_DIR" -name "SKILL.md" -o -name "SKILL.md" | while read skill_file; do
  # Get the plugin directory (parent of skills/ or evaluations/)
  plugin_dir=$(echo "$skill_file" | sed 's|/skills/.*||' | sed 's|/evaluations/.*||')
  plugin_name=$(basename "$plugin_dir")
  
  echo "Converting: $plugin_name"
  echo "  Found: $skill_file"
  
  # Define OpenCode plugin name (remove claude- prefix, simplify)
  opencode_name=$(echo "$plugin_name" | sed 's/^claude-/opencode-/' | sed 's/-upload$//' | sed 's/-tracker$/-tracker/' | sed 's/-transcriber$/-transcriber/')
  opencode_dir_name=$(echo "$opencode_name" | sed 's/^opencode-//')
  
  # Create destination directory
  dest_dir="$OPENCODE_PLUGINS_DIR/$opencode_dir_name"
  mkdir -p "$dest_dir"
  
  # Create a basic OpenCode plugin from the SKILL.md
  cat > "$dest_dir/index.js" <<EOF
/**
 * OpenCode Plugin: $opencode_name
 * 
 * Converted from Claude plugin: $plugin_name
 * Original: MSApps Claude Plugins
 */

export const $(echo ${plugin_name} | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++){$i=toupper(substr($i,1,1)) substr($i,2)}}1' | sed 's/ //g')Plugin = async ({ project, client, \$, directory, worktree }) => {
  console.log("$plugin_name plugin initialized!")

  return {
    // Tool definitions - converted from SKILL.md
    tool: {
      // Add tools based on original plugin functionality
      // Reference original SKILL.md for implementation details
    },

    // Event hooks
    event: async ({ event }) => {
      if (event.type === "session.created") {
        console.log("$plugin_name plugin ready")
      }
    },

    // Log plugin initialization
    "session.created": async (input, output) => {
      await client.app.log({
        body: {
          service: "$plugin_name",
          level: "info",
          message: "$plugin_name plugin loaded",
          extra: { directory }
        }
      })
    }
  }
}

/*
Original SKILL.md content for reference:
$(cat "$skill_file")
*/
EOF

  # Create package.json
  cat > "$dest_dir/package.json" <<EOF
{
  "name": "$opencode_name",
  "version": "1.0.0",
  "description": "Converted from Claude plugin: $plugin_name. OpenCode plugin.",
  "main": "index.js",
  "keywords": ["opencode", "plugin", "$(echo $plugin_name | sed 's/-/ /g')"],
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

  echo "  ✓ Created $dest_dir"
  echo ""
done

echo "Batch conversion complete!"
echo ""
echo "Next steps:"
echo "1. Review converted plugins in $OPENCODE_PLUGINS_DIR"
echo "2. Customize each plugin's index.js with proper tool definitions"
echo "3. Test plugins with OpenCode"
echo "4. Commit and push to GitHub"
