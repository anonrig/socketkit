import { Configuration, V0alpha2Api } from '@ory/kratos-client'
import { kratosUrl } from 'helpers/config.js'

export const client = new V0alpha2Api(
  new Configuration({
    baseOptions: {
      withCredentials: true,
    },
    basePath: kratosUrl,
  }),
)

export const endpoints = {
  errors: `${kratosUrl}/self-service/errors`,
  login: `${kratosUrl}/self-service/login/browser`,
  logout: `${kratosUrl}/self-service/browser/flows/logout`,
  profile: `${kratosUrl}/self-service/settings/browser`,
  recover: `${kratosUrl}/self-service/recovery/browser`,
  register: `${kratosUrl}/self-service/registration/browser`,
  verification: `${kratosUrl}/self-service/verification/browser`,
}
