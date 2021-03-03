import { fetcher } from '../../helpers/fetcher.js'

export async function getServerSideProps(ctx) {
  const { cookie, referer } = ctx.req?.headers ?? {}
  const { rows } = await fetcher('applications', {
    headers: { cookie, referer },
  })

  if (!rows.length) {
    return {
      notFound: true,
    }
  }

  return {
    redirect: {
      destination: `/applications/${rows[0].application_id}/general`,
      permanent: false,
    },
  }
}

export default function Applications() {
  return <div></div>
}
