#!/bin/bash

# convert-all-plugins.sh
# Properly convert all Claude plugins to OpenCode format
# Uses the first SKILL.md found in each plugin directory

set -e

CLAUDE_PLUGINS_DIR="/Users/michalshatz/Documents/Claude/claude-plugins/plugins"
OPENCODE_PLUGINS_DIR="/Users/michalshatz/Documents/Claude/opencode-plugins/plugins"

echo "Converting all Claude plugins to OpenCode format..."
echo ""

# Process each plugin directory
for plugin_dir in "$CLAUDE_PLUGINS_DIR"/*/; do
  plugin_name=$(basename "$plugin_dir")
  
  # Skip if not a directory or is a special directory
  if [ ! -d "$plugin_dir" ] || [[ "$plugin_name" == "."* ]] || [[ "$plugin_name" == "mcps biz" ]] || [[ "$plugin_name" == "msapps-private-plugins" ]] || [[ "$plugin_name" == "msapps-public plugins" ]]; then
    continue
  fi
  
  echo "Processing: $plugin_name"
  
  # Find the first SKILL.md in the plugin directory
  skill_file=$(find "$plugin_dir" -name "SKILL.md" -o -name "SKILL.md" | head -1)
  
  if [ -z "$skill_file" ]; then
    echo "  ✗ No SKILL.md found, skipping..."
    continue
  fi
  
  echo "  Found: $skill_file"
  
  # Define OpenCode names
  opencode_name=$(echo "$plugin_name" | sed 's/^claude-/opencode-/' | sed 's/-upload$//' | sed 's/-tracker$/-tracker/' | sed 's/-transcriber$/-transcriber/')
  opencode_dir_name=$(echo "$opencode_name" | sed 's/^opencode-//' | sed 's/google-drive/drive/' | sed 's/toggl-time/toggl/' | sed 's/youtube/youtube/')
  
  # Create destination directory
  dest_dir="$OPENCODE_PLUGINS_DIR/$opencode_dir_name"
  mkdir -p "$dest_dir"
  
  # Create a proper OpenCode plugin index.js
  # Extract plugin description from SKILL.md
  description=$(head -20 "$skill_file" | grep -E "^#|description" | head -3 | tr '\n' ' ' | sed 's/# //g')
  
  cat > "$dest_dir/index.js" <<EOF
/**
 * OpenCode Plugin: $opencode_name
 * 
 * $description
 * Original: MSApps Claude Plugins ($plugin_name)
 */

export const $(echo ${plugin_name} | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++){$i=toupper(substr($i,1,1)) substr($i,2)}}1' | tr -d ' ')Plugin = async ({ project, client, \$, directory, worktree }) => {
  console.log("$plugin_name plugin initialized!")

  return {
    // Tool definitions converted from SKILL.md
    tool: {
      // Add tools based on the original plugin functionality
      // Reference: $skill_file
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

echo "Conversion complete!"
echo ""
echo "Plugins converted to: $OPENCODE_PLUGINS_DIR"
echo ""
echo "Next steps:"
echo "1. Review each plugin's index.js"
echo "2. Implement proper tool definitions based on original SKILL.md"
echo "3. Test with OpenCode"
echo "4. Commit and push to GitHub"
