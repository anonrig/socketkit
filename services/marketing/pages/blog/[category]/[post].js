import ReactMarkdown from 'react-markdown'
import { BreadcrumbJsonLd, BlogJsonLd, NextSeo } from 'next-seo'
import Layout from 'components/layout.js'
import { fetchEntry } from 'helpers/contentful.js'
import extractor from 'keyword-extractor'

export async function getServerSideProps({ query: { category, post }, resolvedUrl }) {
  const entry = await fetchEntry('guide', category, post)

  if (!entry) {
    return {
      notFound: true,
    }
  }
  return { props: { entry, url: resolvedUrl } }
}

export default function Post({ entry, url }) {
  return (
    <Layout>
      <>
        <NextSeo
          title={entry.fields.title}
          description={entry.fields.short_description}
          openGraph={{
            title: entry.fields.title,
            description: entry.fields.short_description,
            url,
            type: 'article',
            article: {
              publishedTime: entry.sys.createdAt,
              modifiedTime: entry.sys.updatedAt,
              expirationTime: '2022-12-21T22:04:11Z',
              section: entry.fields.category.fields.title,
              tags: extractor.extract(entry.fields.short_description, {
                language: 'english',
                remove_digits: true,
                return_changed_case: true,
                remove_duplicates: true,
              }),
            },
            images: [
              {
                url: entry.fields.asset.fields.file.url,
                width: entry.fields.asset.fields.file.details.image.width,
                height: entry.fields.asset.fields.file.details.image.height,
                alt: entry.fields.asset.fields.title,
              },
            ],
          }}
        />

        <BreadcrumbJsonLd
          itemListElements={[
            {
              position: 1,
              name: 'Guides & Tips',
              item: 'https://socketkit.com/blog',
            },
            {
              position: 2,
              name: entry.fields.title,
              item: `https://socketkit.com${url}`,
            },
          ]}
        />

        <BlogJsonLd
          url={url}
          title={entry.fields.title}
          images={[entry.fields.asset.fields.file.url]}
          datePublished={entry.sys.createdAt}
          dateModified={entry.sys.updatedAt}
          authorName={entry.fields.author.fields.name}
          description={entry.fields.short_description}
        />

        <div className="relative py-16 bg-white overflow-hidden">
          <div className="relative px-4 sm:px-6 lg:px-8">
            <div className="text-lg max-w-prose mx-auto">
              <h1>
                <span className="block text-base text-center text-orange-500 font-bold tracking-wide uppercase">
                  {entry.fields.category.fields.title}
                </span>
                <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  {entry.fields.title}
                </span>
              </h1>
              <p className="mt-8 text-xl text-gray-500 leading-8">
                {entry.fields.short_description}
              </p>
            </div>
            <ReactMarkdown className="mt-6 prose prose-orange prose-lg text-warmGray-500 mx-auto">
              {entry.fields.full_content}
            </ReactMarkdown>
          </div>
        </div>
      </>
    </Layout>
  )
}
