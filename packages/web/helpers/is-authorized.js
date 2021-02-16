import { Configuration, PublicApi } from '@ory/kratos-client'
import { createContext } from 'react'

export const client = new PublicApi(new Configuration({
  basePath: process.env.NEXT_PUBLIC_KRATOS_URL,
  baseOptions: {
    withCredentials: true,
  },
}))

/**
 * @returns {import("react").Context<{ session: import("@ory/kratos-client").Session | null}>}
 */
export const AuthContext = createContext({
  session: null 
})
