import { createContext } from 'react'

export const AuthContext = createContext({
  session: null,
  payment: null,
  integration: null,
})
