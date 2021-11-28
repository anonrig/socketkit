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
  const { Applications, Integrations, Reviews } = grpc.loadPackageDefinition(
    loader.loadSync(path.join('.', 'protofiles/store.proto'), config.grpc_options),
  )

  return {
    applications: new Applications(url, grpc.credentials.createInsecure()),
    integrations: new Integrations(url, grpc.credentials.createInsecure()),
    reviews: new Reviews(url, grpc.credentials.createInsecure()),
  }
}
