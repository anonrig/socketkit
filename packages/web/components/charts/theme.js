/**
 * @type {import('@nivo/core').Theme} theme
 */
const theme = {
  textColor: '#1C1917',
  fontSize: '0.75rem',
  fontFamily: `Inter var, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
  labels: {
    text: {
      fontSize: '0.75rem',
    },
  },
  grid: {
    line: {
      stroke: '#F9F9F9',
      strokeWidth: 1,
      strokeOpacity: 1,
    },
  },
  legends: {
    text: {
      fontSize: '0.75rem',
    },
  },
  crosshair: {
    line: {
      stroke: '#1C1917',
      strokeOpacity: 0.5,
    },
  },
  tooltip: {
    container: {
      backgroundColor: 'transparent',
      border: 'none',
      boxShadow: 'none',
    },
  },
}

export default theme
