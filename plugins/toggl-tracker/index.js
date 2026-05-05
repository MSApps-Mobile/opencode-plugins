/**
 * OpenCode Plugin: Toggl Time Tracker
 * 
 * Track time with Toggl - start/stop timers, generate reports
 * Original: MSApps Claude Plugins (claude-plugins/toggl-time-tracker)
 */

export const TogglTrackerPlugin = async ({ project, client, $, directory, worktree }) => {
  console.log("Toggl Tracker plugin initialized!")

  return {
    // Custom tools for Toggl operations
    tool: {
      "toggl-start": {
        description: "Start a new Toggl time entry timer",
        args: {
          description: {
            type: "string",
            description: "Description of the task being worked on"
          },
          projectId: {
            type: "number",
            description: "Optional Toggl project ID"
          }
        },
        execute: async (args, context) => {
          const { description, projectId } = args
          
          try {
            // Read config from ~/.opencode-toggl-config.json
            const configPath = "~/.opencode-toggl-config.json"
            const configExists = await $`test -f ${configPath}`.quiet()
            
            if (configExists.exitCode !== 0) {
              return "Config not found. Please create ~/.opencode-toggl-config.json with your Toggl API token and workspace ID."
            }

            const configResult = await $`cat ${configPath}`
            const config = JSON.parse(configResult.stdout)

            if (!config.apiToken || !config.workspaceId) {
              return "Invalid config. Please ensure your config has 'apiToken' and 'workspaceId' fields."
            }

            // Start timer via Toggl API
            const timeEntry = {
              description: description || "OpenCode session",
              wid: config.workspaceId,
              ...(projectId && { pid: projectId })
            }

            const result = await $`curl -X POST "https://api.track.toggl.com/api/v8/time_entries" \
              -H "Content-Type: application/json" \
              -u "${config.apiToken}:api_token" \
              -d '${JSON.stringify({ time_entry: timeEntry })}'`

            return `Timer started!\n${result.stdout}`
          } catch (error) {
            return `Failed to start timer: ${error.message}`
          }
        }
      },

      "toggl-stop": {
        description: "Stop the current running Toggl timer",
        execute: async (args, context) => {
          try {
            const configPath = "~/.opencode-toggl-config.json"
            const configResult = await $`cat ${configPath}`
            const config = JSON.parse(configResult.stdout)

            // Get current timer
            const currentResult = await $`curl -X GET "https://api.track.toggl.com/api/v8/time_entries/current" \
              -u "${config.apiToken}:api_token"`

            const current = JSON.parse(currentResult.stdout)
            
            if (!current.data || !current.data.id) {
              return "No active timer found."
            }

            // Stop timer
            const stopResult = await $`curl -X PUT "https://api.track.toggl.com/api/v8/time_entries/${current.data.id}/stop" \
              -u "${config.apiToken}:api_token"`

            return `Timer stopped!\nDuration: ${current.data.duration}ms`
          } catch (error) {
            return `Failed to stop timer: ${error.message}`
          }
        }
      },

      "toggl-report": {
        description: "Generate a Toggl time report for a date range",
        args: {
          startDate: {
            type: "string",
            description: "Start date (YYYY-MM-DD)"
          },
          endDate: {
            type: "string", 
            description: "End date (YYYY-MM-DD)"
          }
        },
        execute: async (args, context) => {
          const { startDate, endDate } = args
          
          try {
            const configPath = "~/.opencode-toggl-config.json"
            const configResult = await $`cat ${configPath}`
            const config = JSON.parse(configResult.stdout)

            const result = await $`curl -X GET "https://api.track.toggl.com/reports/api/v2/details?workspace_id=${config.workspaceId}&since=${startDate}&until=${endDate}" \
              -u "${config.apiToken}:api_token"`

            return `Time Report (${startDate} to ${endDate}):\n${result.stdout}`
          } catch (error) {
            return `Failed to generate report: ${error.message}`
          }
        }
      }
    },

    // Event hooks
    event: async ({ event }) => {
      if (event.type === "session.created") {
        console.log("Toggl Tracker plugin ready")
      }
    },

    // Log plugin initialization
    "session.created": async (input, output) => {
      await client.app.log({
        body: {
          service: "toggl-tracker",
          level: "info",
          message: "Toggl Tracker plugin loaded",
          extra: { directory }
        }
      })
    }
  }
}
