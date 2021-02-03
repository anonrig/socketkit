import fixer from 'fixer-api'
import config from './config.js'
fixer.set({ accessKey: config.fixerKey })
export default fixer
