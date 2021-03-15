import { verify } from '../hooks.js'
import f from '../server.js'

export default (f, _opts, done) => {
  addRoute(f, '/average-duration', f.grpc.reports.averageDuration, {
    average_trial_duration: { type: 'number' },
    average_subscription_duration: { type: 'number' },
  })
  addRoute(f, '/subscribers', f.grpc.reports.subscribers, {
    count: { type: 'number' },
    avg_age: { type: 'string' },
  })
  addRoute(f, '/trials', f.grpc.reports.trials, {
    secondary: { type: 'number' },
    previous_secondary: { type: 'number' },
  })
  addRoute(f, '/subscriptions', f.grpc.reports.subscriptions, {
    count: { type: 'number' },
    avg_total_base_developer_proceeds: { type: 'string' },
  })
  addRoute(f, '/mrr', f.grpc.reports.mrr, {
    month: { type: 'string' },
    mrr: { type: 'string' },
    clients: { type: 'number' },
    new_mrr: { type: 'string' },
    expansion_mrr: { type: 'string' },
    churned_mrr: { type: 'string' },
    contraction_mrr: { type: 'string' },
    net_new_mrr: { type: 'string' },
    mrr_churn: { type: 'string' },
    clients_churn: { type: 'number' },
    arpu: { type: 'string' },
  })
  done()
}

function addRoute(f, path, grpc_method, additional_properties) {
  f.route({
    method: 'GET',
    path: path,
    schema: {
      querystring: {
        type: 'object',
        properties: {
          start_date: {
            type: 'string',
            format: 'date',
          },
          end_date: {
            type: 'string',
            format: 'date',
          },
          interval: {
            type: 'string',
            default: 'week',
          },
        },
        required: ['start_date', 'end_date', 'interval'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            rows: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  primary: { type: 'string' },
                  ...additional_properties,
                },
                required: ['primary'],
              },
            },
          },
        },
      },
    },
    preHandler: verify,
    handler: async ({ accounts: [account], query }) => {
      if (!account) {
        throw f.httpErrors.notFound(`Account not found`)
      }

      return grpc_method({
        account_id: account.account_id,
        start_date: query.start_date,
        end_date: query.end_date,
        interval: `1 ${query.interval}`,
      })
    },
  })
}
