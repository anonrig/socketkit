import knex from 'knex'
import pg from 'pg'
import range from 'pg-range'

import config from '../config.js'
import { ISODate } from '../types.js'

pg.types.setTypeParser(20, 'text', parseInt)
pg.types.setTypeParser(pg.types.builtins.DATE, (v) => (!!v ? ISODate.parse(v) : null))
range.install(pg)

export default knex(config.knex)
