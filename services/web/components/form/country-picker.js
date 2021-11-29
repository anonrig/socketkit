/* eslint-disable react/display-name */
import cx from 'classnames'
import countries from 'helpers/countries.json'
import PropTypes from 'prop-types'
import { forwardRef } from 'react'
import Select from 'react-select'

const CountryPicker = forwardRef(({ className, onChange, value, ...props }, ref) => {
  if (typeof value === 'string') {
    value = countries[value.toLowerCase()]
  } else if (Array.isArray(value)) {
    value = value.map((v) => {
      if (typeof v === 'string') {
        return Object.assign({}, countries[v.toLowerCase()], { value: v })
      }
      return v
    })
  }

  return (
    <Select
      options={Object.keys(countries).map((k) => ({ ...countries[k.toString()], value: k }))}
      getOptionLabel={(option) => {
        if (typeof option === 'object') return option.name
        return countries[option.toLowerCase()]?.name
      }}
      getOptionValue={(option) => option.value}
      className={cx('mt-1 sm:text-sm text-md', className)}
      ref={ref}
      onChange={(values) => onChange(values)}
      value={value}
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
      {...props}
    />
  )
})

CountryPicker.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
}

export default CountryPicker
