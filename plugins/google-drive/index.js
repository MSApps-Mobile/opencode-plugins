/**
 * OpenCode Plugin: Google Drive Upload
 * 
 * Upload files to Google Drive via Google Apps Script
 * Original: MSApps Claude Plugins (claude-plugins/google-drive-upload)
 */

export const GoogleDrivePlugin = async ({ project, client, $, directory, worktree }) => {
  console.log("Google Drive plugin initialized!")

  return {
    // Custom tool for uploading files to Google Drive
    tool: {
      "google-drive-upload": {
        description: "Upload files to Google Drive using Google Apps Script. Supports single files, multiple files, and directories.",
        args: {
          filePath: {
            type: "string",
            description: "Path to file or directory to upload"
          },
          folderId: {
            type: "string",
            description: "Optional Google Drive folder ID to upload to"
          }
        },
        execute: async (args, context) => {
          const { filePath, folderId } = args
          
          // Read config from ~/.opencode-google-drive-config.json
          const configPath = "~/.opencode-google-drive-config.json"
          
          try {
            // Check if config exists
            const configExists = await $`test -f ${configPath}`.quiet()
            if (!configExists.exitCode === 0) {
              return "Config not found. Please create ~/.opencode-google-drive-config.json with your Google Apps Script URL and API key."
            }

            // Read config
            const configResult = await $`cat ${configPath}`
            const config = JSON.parse(configResult.stdout)

            if (!config.url || !config.apiKey) {
              return "Invalid config. Please ensure your config has 'url' and 'apiKey' fields."
            }

            // Upload file using curl
            const uploadCommand = folderId 
              ? `curl -X POST "${config.url}" -H "Content-Type: application/json" -d '{"apiKey":"${config.apiKey}","filePath":"${filePath}","folderId":"${folderId}"}'`
              : `curl -X POST "${config.url}" -H "Content-Type: application/json" -d '{"apiKey":"${config.apiKey}","filePath":"${filePath}"}'`

            const result = await $`${uploadCommand}`
            
            return `File uploaded successfully!\n${result.stdout}`
          } catch (error) {
            return `Upload failed: ${error.message}`
          }
        }
      }
    },

    // Event hooks
    event: async ({ event }) => {
      if (event.type === "session.created") {
        console.log("Google Drive plugin ready")
      }
    },

    // Log plugin initialization
    "session.created": async (input, output) => {
      await client.app.log({
        body: {
          service: "google-drive",
          level: "info",
          message: "Google Drive plugin loaded",
          extra: { directory }
        }
      })
    }
  }
}
