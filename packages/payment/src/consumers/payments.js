import * as Session from '../models/session.js'
import * as Webhook from '../models/webhook.js'

import grpc from '@grpc/grpc-js'

export async function createSession(ctx) {
  const { account_id, session_type, email } = ctx.req

  if (session_type === 'portal') {
    ctx.res = await Session.createPortal({ account_id, email })
  } else if (session_type === 'checkout') {
    ctx.res = await Session.createCheckout({ account_id, email })
  } else {
    const error = new Error(`Session type not found`)
    error.code = grpc.status.NOT_FOUND
    throw error
  }
}

export async function validateWebhook(ctx) {
  await Webhook.validate(ctx.req)
  ctx.res = {}
}
