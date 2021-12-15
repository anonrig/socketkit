import cx from 'classnames'
import PropTypes from 'prop-types'

function ButtonGroup({ selected, items, onSelected }) {
  return (
    <span className="relative z-0 inline-flex shadow-sm rounded-md">
      {items.map((item, i) => (
        <button
          onClick={() => onSelected(item)}
          key={item}
          type="button"
          className={cx([
            selected === item
              ? 'bg-stone-50 text-orange-500 hover:bg-white'
              : 'bg-white text-stone-900 hover:text-stone-500',
            i === 0 ? 'rounded-l-md' : null,
            i !== 0 && i !== items.length - 1 ? '-ml-px' : null,
            i === items.length - 1 ? '-ml-px rounded-r-md' : null,
            'border-gray-300 relative inline-flex items-center px-4 py-2 border text-xs font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500',
          ])}
        >
          {item}
        </button>
      ))}
    </span>
  )
}

ButtonGroup.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  onSelected: PropTypes.func.isRequired,
  selected: PropTypes.string,
}

export default ButtonGroup
