export default function addSchemas(f) {
  f.addSchema({
    $id: 'integration-requirement',
    type: 'object',
    properties: {
      access_token: { type: 'string' },
    },
  })

  f.addSchema({
    $id: 'integration',
    type: 'object',
    properties: {
      integration_id: { type: 'string' },
      title: { type: 'string' },
      description: { type: 'string' },
      requirement_schema: {
        type: 'object',
        additionalProperties: true,
      },
    },
  })
}
