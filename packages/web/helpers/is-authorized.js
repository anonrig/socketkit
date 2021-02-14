import { Configuration, PublicApi } from '@ory/kratos-client'
import { createContext } from 'react'

export const client = new PublicApi(new Configuration({
  basePath: process.env.KRATOS_URL,
  baseOptions: {
    includeCredentials: true,
  }
}))

/**
 * @param {import("next").NextPageContext} ctx 
 * @returns {Promise<import("@ory/kratos-client").Session | null>}
 */
export default async function isAuthorized(ctx) {
  try {
    const { data } = await client.whoami(ctx.req?.headers.cookie, ctx.req?.headers.authorization)
    return data
  } catch (error) {
    return null
  }
}

/**
 * @returns {import("react").Context<{ session: import("@ory/kratos-client").Session | null}>}
 */
export const AuthContext = createContext({
  session: null 
})
