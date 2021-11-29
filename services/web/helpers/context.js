import { createContext } from 'react'

export const AuthContext = createContext({
  integration: null,
  session: null,
})
