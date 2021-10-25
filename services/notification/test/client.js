import grpc from '@grpc/grpc-js'
import loader from '@grpc/proto-loader'
import path from 'path'
import config from '../src/config.js'

export const getRandomPort = (a = 1000, b = 65000) => {
  const lower = Math.ceil(Math.min(a, b))
  const upper = Math.floor(Math.max(a, b))
  return Math.floor(lower + Math.random() * (upper - lower + 1))
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
  const { Notifications, Integrations } = grpc.loadPackageDefinition(
    loader.loadSync(path.join('.', 'protofiles/notification.proto'), defaults),
  )

  return {
    notification: new Notifications(url, grpc.credentials.createInsecure()),
    integration: new Integrations(url, grpc.credentials.createInsecure()),
  }
}
