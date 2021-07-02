import Link from 'next/link'
import dayjs from 'dayjs'
import { BreadcrumbJsonLd, NextSeo } from 'next-seo'
import PropTypes from 'prop-types'
import Layout from 'components/layout.js'
import { fetchEntries } from 'helpers/contentful.js'

export async function getServerSideProps() {
  try {
    const entries = await fetchEntries('guide')
    return { props: { entries } }
  } catch (error) {
    return { props: { entries: [] } }
  }
}

function Guides({ entries = [] }) {
  return (
    <Layout>
      <NextSeo
        title={'Guides & Tips'}
        description={`We care about sharing the things we learned along the way. Here's the tips and tricks on using Socketkit with your mobile application.`}
      />

      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: 'Guides & Tips',
            item: 'https://socketkit.com/blog',
          },
        ]}
      />

      <div className="relative bg-white pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
              Guides & Tips
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              We care about sharing the things we learned along the way.
            </p>
          </div>
          <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            {entries.map((entry) => (
              <div
                className="flex flex-col rounded-lg shadow-lg overflow-hidden"
                key={entry.sys.id}>
                <div className="flex-shrink-0">
                  <Link href={`/blog/${entry.fields.category.fields.slug}/${entry.fields.slug}`}>
                    <a>
                      <picture>
                        <source
                          srcSet={`${entry.fields.asset.fields.file.url}?h=250&q=80&fm=webp`}
                          type="image/webp"
                        />
                        <source
                          srcSet={`${entry.fields.asset.fields.file.url}?h=250&q=80&fm=jpeg`}
                          type="image/jpeg"
                        />
                        <img
                          className="h-48 w-full object-cover"
                          src={`${entry.fields.asset.fields.file.url}?h=250&q=80&fm=jpeg`}
                          alt={entry.fields.asset.fields.title}
                        />
                      </picture>
                    </a>
                  </Link>
                </div>
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-500">
                      {entry.fields.category.fields.title}
                    </p>
                    <Link href={`/blog/${entry.fields.category.fields.slug}/${entry.fields.slug}`}>
                      <a className="block mt-2">
                        <p className="text-xl font-semibold text-gray-900">{entry.fields.title}</p>
                        <p className="mt-3 text-base text-gray-500">
                          {entry.fields.short_description}
                        </p>
                      </a>
                    </Link>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <span className="sr-only">{entry.fields.author.fields.name}</span>
                      <img
                        className="h-10 w-10 rounded-full"
                        src={`${entry.fields.author.fields.profile_picture.fields.file.url}?q=100&h=40&w=40`}
                        alt={entry.fields.author.fields.profile_picture.fields.description}
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {entry.fields.author.fields.name}
                      </p>
                      <div className="flex space-x-1 text-sm text-gray-500">
                        <time dateTime={dayjs(entry.sys.createdAt).format('YYYY-MM-DD')}>
                          {dayjs(entry.sys.createdAt).format('MMMM DD, YYYY')}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

Guides.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object),
}

export default Guides
