import InlineRating from 'components/inline-rating.js'

export default [
  {
    accessor: function GetReviewCountry(fields) {
      const country_id = fields.country_id.toUpperCase()
      return (
        <div className="flex flex-row space-x-2 flex-1">
          {country_id}
          <InlineRating rating={fields.score ?? 1} className="ml-1" />
        </div>
      )
    },
    className: 'font-semibold w-24',
    id: 'country_id',
  },
  {
    Header: 'Version',
    accessor: 'version_number',
    className: 'w-20',
    id: 'version_number',
  },
  {
    Header: 'Content',
    accessor: function GetReviewContent(field) {
      return (
        <div className="space-y-1 w-full relative overflow-hidden">
          <div className="text-xs font-semibold">
            {field.title} -{' '}
            <a className="font-bold hover:text-orange-400" href={field.user_url}>
              {field.username}
            </a>
          </div>
          <p className="text-sm line-clamp-2">{field.content}</p>
        </div>
      )
    },
    id: 'content',
  },
]
