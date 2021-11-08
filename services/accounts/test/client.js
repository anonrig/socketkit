/* eslint-disable */

import grpc from '@grpc/grpc-js'
import loader from '@grpc/proto-loader'
import path from 'path'
import { promisify } from 'util'
import config from '../src/config.js'

export const getRandomPort = (a = 1000, b = 65000) => {
  const lower = Math.ceil(Math.min(a, b))
  const upper = Math.floor(Math.max(a, b))
  return Math.floor(lower + Math.random() * (upper - lower + 1))
}

export function promisifyAll(subscriber) {
  const to = {}
  for (const k in subscriber) {
    if (typeof subscriber[k] !== 'function') continue
    to[k] = promisify(subscriber[k].bind(subscriber))
  }
  return to
}

export function getClients(port = getRandomPort()) {
  const url = `0.0.0.0:${port ?? config.port}`
  const defaults = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
  const { Accounts, Identities } = grpc.loadPackageDefinition(
    loader.loadSync(path.join('.', 'protofiles/accounts.proto'), defaults),
  )

  return {
    accounts: new Accounts(url, grpc.credentials.createInsecure()),
    identities: new Identities(url, grpc.credentials.createInsecure()),
  }
}
