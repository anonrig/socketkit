import { Configuration, PublicApi } from '@ory/kratos-client'
import { kratosUrl } from 'helpers/config.js'

export const client = new PublicApi(
  new Configuration({
    basePath: kratosUrl,
    baseOptions: {
      withCredentials: true,
    },
  }),
)

export const endpoints = {
  login: `${kratosUrl}/self-service/login/browser`,
  register: `${kratosUrl}/self-service/registration/browser`,
  recover: `${kratosUrl}/self-service/recovery/browser`,
  profile: `${kratosUrl}/self-service/settings/browser`,
  logout: `${kratosUrl}/self-service/browser/flows/logout`,
  verification: `${kratosUrl}/self-service/verification/browser`,
  errors: `${kratosUrl}/self-service/errors`,
}
