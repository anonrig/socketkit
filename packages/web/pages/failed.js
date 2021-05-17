import PropTypes from 'prop-types'
import { client } from '../helpers/is-authorized.js'
import pkg from '../package.json'
import { endpoints } from '../helpers/kratos.js'

/**
 * @param {import("next").NextPageContext} ctx
 */
export async function getServerSideProps(ctx) {
  const { error } = ctx.query

  const redirect = () => {
    ctx.res.statusCode = 302
    ctx.res?.setHeader('Location', '/')
    return { props: {} }
  }

  if (!error) {
    return redirect()
  }

  try {
    const { data } = await client.getSelfServiceError(error)

    if (data.errors.length == 0) {
      return redirect()
    }

    return {
      props: {
        data,
      },
    }
  } catch (error) {
    return redirect()
  }
}

function Failed({ data }) {
  console.error(data.errors[0]?.message)
  return (
    <div className="mb-48">
      <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl my-4 mb-8">
        Uncaught error (v{pkg.version})
      </h2>
      <p className="text-xl text-warmGray-500 mb-4">
        We&apos;re working really hard to fix this issue. <br></br>
      </p>
      <a
        href={endpoints.login}
        className={
          'transition ease-in-out duration-150 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 w-44'
        }>
        Go to Login
      </a>
    </div>
  )
}

Failed.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    errors: PropTypes.arrayOf(
      PropTypes.shape({
        code: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
      }),
    ),
  }),
}

export default Failed
