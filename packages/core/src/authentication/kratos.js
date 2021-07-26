import { Configuration, V0alpha1Api } from '@ory/kratos-client'
import config from '../config.js'

export const kratos = new V0alpha1Api(
  new Configuration({ basePath: config.kratos.public }),
)

export const kratos_private = new V0alpha1Api(
  new Configuration({ basePath: config.kratos.private }),
)
