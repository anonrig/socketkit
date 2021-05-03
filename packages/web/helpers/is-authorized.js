import { Configuration, PublicApi } from '@oryd/kratos-client'
import { createContext } from 'react'
import { kratosUrl } from 'helpers/config.js'

export const client = new PublicApi(
  new Configuration({
    basePath: kratosUrl,
    baseOptions: {
      withCredentials: true,
    },
  }),
)

/**
 * @returns {import("react").Context<{ session: import("@ory/kratos-client").Session | null}>}
 */
export const AuthContext = createContext({
  session: null,
})
