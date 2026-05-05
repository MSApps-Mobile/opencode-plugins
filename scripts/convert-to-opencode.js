#!/usr/bin/env node

/**
 * convert-to-opencode.js
 * 
 * Converts Claude plugins to OpenCode format
 * Usage: node convert-to-opencode.js <plugin-dir>
 */

const fs = require('fs')
const path = require('path')

function convertPlugin(claudePluginPath) {
  const pluginName = path.basename(claudePluginPath)
  const opencodePluginName = pluginName.replace('claude-', 'opencode-')
  
  console.log(`Converting ${pluginName} to ${opencodePluginName}...`)
  
  // Read the SKILL.md file
  const skillMdPath = path.join(claudePluginPath, 'SKILL.md')
  if (!fs.existsSync(skillMdPath)) {
    console.error(`SKILL.md not found in ${claudePluginPath}`)
    return
  }
  
  const skillContent = fs.readFileSync(skillMdPath, 'utf8')
  
  // Create OpenCode plugin structure
  const opencodePluginDir = path.join(__dirname, '..', 'plugins', opencodePluginName.replace('opencode-', ''))
  if (!fs.existsSync(opencodePluginDir)) {
    fs.mkdirSync(opencodePluginDir, { recursive: true })
  }
  
  // Generate index.js from SKILL.md
  const indexJs = generateOpenCodePlugin(skillContent, pluginName)
  fs.writeFileSync(path.join(opencodePluginDir, 'index.js'), indexJs)
  
  // Generate package.json
  const packageJson = generatePackageJson(pluginName, opencodePluginName)
  fs.writeFileSync(path.join(opencodePluginDir, 'package.json'), JSON.stringify(packageJson, null, 2))
  
  console.log(`✓ Converted ${pluginName} to ${opencodePluginDir}`)
}

function generateOpenCodePlugin(skillContent, pluginName) {
  const functionName = pluginName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

  return `/**
 * OpenCode Plugin: ${pluginName}
 * 
 * Converted from Claude plugin
 * Original: MSApps Claude Plugins
 */

export const ${functionName}Plugin = async ({ project, client, $, directory, worktree }) => {
  console.log("${pluginName} plugin initialized!")

  return {
    // Tool definitions based on SKILL.md
    tool: {
      // Add tools here based on the original SKILL.md
    },

    // Event hooks
    event: async ({ event }) => {
      if (event.type === "session.created") {
        console.log("${pluginName} plugin ready")
      }
    },

    // Log plugin initialization
    "session.created": async (input, output) => {
      await client.app.log({
        body: {
          service: "${pluginName}",
          level: "info",
          message: "${pluginName} plugin loaded",
          extra: { directory }
        }
      })
    }
  }
}

/*
Original SKILL.md content for reference:

${skillContent}
*/
`
}

function generatePackageJson(pluginName, opencodePluginName) {
  return {
    "name": opencodePluginName,
    "version": "1.0.0",
    "description": `Converted from Claude plugin: ${pluginName}. OpenCode plugin.`,
    "main": "index.js",
    "keywords": ["opencode", "plugin", pluginName.replace('-', ' ')],
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
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.log('Usage: node convert-to-opencode.js <plugin-directory>')
    console.log('Example: node convert-to-opencode.js ../claude-plugins/plugins/google-drive-upload')
    process.exit(1)
  }
  
  const pluginPath = args[0]
  
  if (!fs.existsSync(pluginPath)) {
    console.error(`Plugin directory not found: ${pluginPath}`)
    process.exit(1)
  }
  
  convertPlugin(pluginPath)
}

module.exports = { convertPlugin }
