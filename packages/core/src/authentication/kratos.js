import { Configuration, PublicApi, AdminApi } from '@ory/kratos-client'
import config from '../config.js'

export const kratos = new PublicApi(
  new Configuration({ basePath: config.kratos.public }),
)

export const kratos_private = new AdminApi(
  new Configuration({ basePath: config.kratos.private }),
)
