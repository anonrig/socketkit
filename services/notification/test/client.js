import path from 'path'

import grpc from '@grpc/grpc-js'
import loader from '@grpc/proto-loader'

import config from '../src/config.js'

export const getRandomPort = (a = 1000, b = 65000) => {
  const lower = Math.ceil(Math.min(a, b))
  const upper = Math.floor(Math.max(a, b))
  return Math.floor(lower + Math.random() * (upper - lower + 1))
}

export function getClients(port = getRandomPort()) {
  const url = `0.0.0.0:${port ?? config.port}`
  const file = path.join(
    path.resolve(),
    'node_modules/@socketkit/proto-definitions/notification.proto',
  )
  const { Notifications, Integrations } = grpc.loadPackageDefinition(
    loader.loadSync(file, config.grpc_options),
  )
  return {
    integrations: new Integrations(url, grpc.credentials.createInsecure()),
    notifications: new Notifications(url, grpc.credentials.createInsecure()),
  }
}
