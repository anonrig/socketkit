import PropTypes from 'prop-types'
import useSWR from 'swr'
import IntegrationRow from 'components/scenes/account/integration-row.js'
import { fetcher } from 'helpers/fetcher'
import toast from 'react-hot-toast'
import { useEffect } from 'react'

export async function getServerSideProps(ctx) {
  const { cookie, referer } = ctx.req?.headers ?? {}
  const integrations = await fetcher(`integrations`, {
    headers: { cookie, referer },
  })
  return {
    props: { integrations },
  }
}

function Integrations({ integrations }) {
  const { data, error } = useSWR('integrations', fetcher, { initialData: integrations })

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  return (
    <div className="space-y-4">
      {data?.map(({ category, rows }) => (
        <div className="bg-white shadow rounded-lg" key={category}>
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{category}</h3>
            {rows?.map(({ title, description, slug, integration }) => (
              <div className="mt-5" key={`${slug}`}>
                <IntegrationRow
                  className="mt-2"
                  title={title}
                  description={description}
                  slug={slug}
                  integration={integration}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

Integrations.propTypes = {
  integrations: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      rows: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
        }),
      ),
    }),
  ),
  userIntegrations: PropTypes.arrayOf(
    PropTypes.shape({
      requirement_set_at: PropTypes.string.isRequired,
    }),
  ),
}

export default Integrations
