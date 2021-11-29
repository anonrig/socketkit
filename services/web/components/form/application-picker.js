import cx from 'classnames'
import { fetcher } from 'helpers/fetcher.js'
import PropTypes from 'prop-types'
import AsyncSelect from 'react-select/async'

function ApplicationPicker({ value = null, onChange }) {
  const promiseOptions = async (text) => {
    if (text.length === 0) return []
    return fetcher(`search/applications`, {
      qs: { text },
    })
  }

  return (
    <AsyncSelect
      defaultOptions
      cacheOptions
      formatGroupLabel={(option) => (
        <div className="flex items-center w-full h-full px-4 space-x-4 bg-white border-gray-300 rounded-md">
          <img
            src={option.application_icon.replaceAll('512', '64')}
            alt={option.application_title}
            className="h-6 w-6 rounded-md"
          />
          <div className="flex flex-col flex-1 text-left text-sm text-warmGray-700">
            <p className="truncate font-semibold text-sm">{option.application_title}</p>
          </div>
        </div>
      )}
      getOptionLabel={(option) => (
        <div className={cx('flex items-center w-full space-x-4')}>
          <img
            src={option.application_icon.replaceAll('512', '64')}
            alt={option.application_title}
            className="h-6 w-6 rounded-md"
          />
          <div className="flex flex-col flex-1 text-left text-sm text-warmGray-700">
            <p className="truncate font-semibold text-sm">{option.application_title}</p>
            <div className="text-xs">{option.bundle_id}</div>
          </div>
        </div>
      )}
      getOptionValue={(option) => option.application_id}
      loadOptions={promiseOptions}
      defaultValue={value}
      className={cx('mt-1 sm:text-sm text-md')}
      onChange={onChange}
      isClearable
      placeholder="Type to search applications on AppStore"
      theme={(theme) => ({
        ...theme,
        borderRadius: '0.375rem',
        colors: {
          ...theme.colors,
          primary: 'rgba(249, 115, 22, 1)',
          primary25: '#F5F5F4',
          primary50: '#FAFAF9',
        },
      })}
    />
  )
}

ApplicationPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.shape({
    application_icon: PropTypes.string.isRequired,
    application_id: PropTypes.string.isRequired,
    application_title: PropTypes.string.isRequired,
    bundle_id: PropTypes.string,
  }),
}

export default ApplicationPicker
