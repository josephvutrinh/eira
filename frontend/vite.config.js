import { createLogger, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const colors = {
  reset: '\u001b[0m',
  pink: '\u001b[38;5;213m',
  pinkBold: '\u001b[1;38;5;213m',
  lavender: '\u001b[38;5;183m',
  blue: '\u001b[38;5;69m',
  red: '\u001b[38;5;203m',
  dim: '\u001b[2m',
}

function c(code, text) {
  return `${code}${text}${colors.reset}`
}

function createPinkyLogger() {
  const base = createLogger('info', {
    prefix: c(colors.pinkBold, 'eira'),
    allowClearScreen: true,
  })

  const wrap = (fn, { label, color }) => {
    return (msg, options) => {
      const prefix = c(color, ` ${label} `)
      fn(`${prefix}${msg}`, options)
    }
  }

  return {
    ...base,
    info: wrap(base.info, { label: 'info', color: colors.lavender }),
    warn: wrap(base.warn, { label: 'note', color: colors.pink }),
    error: wrap(base.error, { label: 'error', color: colors.red }),
  }
}

function pinkyBannerPlugin() {
  let shown = false
  return {
    name: 'eira-pinky-banner',
    apply: 'serve',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        if (shown) return
        shown = true

        server.config.logger.info(
          c(
            colors.pink,
            'You are building something that can really help people. Keep going—one small step at a time.',
          ),
        )
        server.config.logger.info(
          `${c(colors.dim, 'Tip:')} Use the Support Chat prompts to demo quickly, then wire real chat later.`,
        )
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  customLogger: createPinkyLogger(),
  plugins: [react(), tailwindcss(), pinkyBannerPlugin()],
})
