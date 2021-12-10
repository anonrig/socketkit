import Pino from 'pino'

export default Pino({
  transport: {
    target: 'pino-pretty',
  },
})
