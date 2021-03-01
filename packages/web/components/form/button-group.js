import PropTypes from 'prop-types'
import cx from 'classnames'

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
              ? 'bg-orange-500 text-white hover:bg-orange-400 border-orange-500'
              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300',
            i === 0 ? 'rounded-l-md' : null,
            i !== 0 && i !== items.length - 1 ? '-ml-px' : null,
            i === items.length - 1 ? '-ml-px rounded-r-md' : null,
            'relative inline-flex items-center px-4 py-2 border text-xs font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500',
          ])}>
          {item}
        </button>
      ))}
    </span>
  )
}

ButtonGroup.propTypes = {
  selected: PropTypes.string,
  onSelected: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
}

export default ButtonGroup
