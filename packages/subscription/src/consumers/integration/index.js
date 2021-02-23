import onValidate from './on-validate.js'
import pg from '../../pg.js'

export const validate = async (ctx) => {
  const { access_token } = ctx.req
  ctx.res = {
    state: await onValidate(access_token),
  }
}
