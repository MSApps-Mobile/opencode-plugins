/**
 * OpenCode Plugin: YouTube Transcriber
 * 
 * Transcribe YouTube videos and playlists - no API key required
 * Uses YouTube's transcript API or Claude in Chrome extension
 * Original: MSApps Claude Plugins (claude-plugins/youtube-transcriber)
 */

export const YouTubeTranscriberPlugin = async ({ project, client, $, directory, worktree }) => {
  console.log("YouTube Transcriber plugin initialized!")

  return {
    // Custom tools for YouTube transcription
    tool: {
      "youtube-transcribe": {
        description: "Transcribe a YouTube video or playlist. No API key required.",
        args: {
          url: {
            type: "string",
            description: "YouTube video or playlist URL"
          },
          language: {
            type: "string",
            description: "Preferred language code (e.g., 'en', 'es', 'fr')"
          }
        },
        execute: async (args, context) => {
          const { url, language = "en" } = args
          
          try {
            // Validate YouTube URL
            if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
              return "Invalid YouTube URL. Please provide a valid YouTube video or playlist URL."
            }

            // Use yt-dlp to extract transcript
            // This requires yt-dlp to be installed: brew install yt-dlp
            const isPlaylist = url.includes("playlist") || url.includes("&list=")
            
            if (isPlaylist) {
              return "Playlist transcription: Use youtube-transcribe-playlist tool for playlists."
            }

            // Extract video ID
            let videoId = url
            if (url.includes("v=")) {
              videoId = url.split("v=")[1].split("&")[0]
            } else if (url.includes("youtu.be/")) {
              videoId = url.split("youtu.be/")[1].split("?")[0]
            }

            // Get transcript using yt-dlp
            const result = await $`yt-dlp --skip-download --write-auto-sub --sub-lang ${language} --convert-subs txt "https://www.youtube.com/watch?v=${videoId}" -o - 2>&1 || echo "yt-dlp not installed or failed"`

            if (result.stdout.includes("not installed")) {
              return "yt-dlp is not installed. Install it with: brew install yt-dlp\n\nAlternatively, if you have Claude in Chrome extension, you can ask Claude to transcribe the video directly."
            }

            return `Transcription for video ${videoId}:\n\n${result.stdout}`
          } catch (error) {
            return `Transcription failed: ${error.message}\n\nTip: Make sure yt-dlp is installed (brew install yt-dlp)`
          }
        }
      },

      "youtube-transcribe-playlist": {
        description": "Transcribe all videos in a YouTube playlist",
        args: {
          playlistUrl: {
            type: "string",
            description: "YouTube playlist URL"
          },
          language: {
            type: "string",
            description": "Preferred language code"
          }
        },
        execute: async (args, context) => {
          const { playlistUrl, language = "en" } = args
          
          try {
            // Extract playlist ID
            const playlistId = playlistUrl.includes("list=") 
              ? playlistUrl.split("list=")[1].split("&")[0]
              : playlistUrl

            // Get playlist items using yt-dlp
            const result = await $`yt-dlp --flat-playlist -J "${playlistUrl}" 2>&1`

            if (result.stdout.includes("not installed")) {
              return "yt-dlp is not installed. Install it with: brew install yt-dlp"
            }

            const playlist = JSON.parse(result.stdout)
            const videos = playlist.entries || []

            return `Playlist: ${playlist.title}\nTotal videos: ${videos.length}\n\nUse youtube-transcribe tool for individual videos.`
          } catch (error) {
            return `Playlist transcription failed: ${error.message}`
          }
        }
      }
    },

    // Event hooks
    event: async ({ event }) => {
      if (event.type === "session.created") {
        console.log("YouTube Transcriber plugin ready")
      }
    },

    // Log plugin initialization
    "session.created": async (input, output) => {
      await client.app.log({
        body: {
          service: "youtube-transcriber",
          level: "info",
          message": "YouTube Transcriber plugin loaded",
          extra: { directory }
        }
      })
    }
  }
}
