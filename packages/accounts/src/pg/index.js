import knex from 'knex'
import pg from 'pg'
import config from '../config.js'

const types = pg.types

types.setTypeParser(types.builtins.TIME, (time) => time)
types.setTypeParser(types.builtins.TIMESTAMP, (time) => time)
types.setTypeParser(types.builtins.TIMESTAMPTZ, (time) => time)

export default knex(config.knex)
