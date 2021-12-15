import { StarIcon as OutlineStar } from '@heroicons/react/outline'
import { StarIcon as SolidStar } from '@heroicons/react/solid'
import cx from 'classnames'
import PropTypes from 'prop-types'

function InlineRating({ rating, className }) {
  const getStar = (current) => {
    if (rating >= current) {
      return <SolidStar className="h-5 w-5 text-orange-500" key={`${current}-star`} />
    }
    return <OutlineStar className="h-5 w-5 text-stone-200" key={`${current}-star`} />
  }

  return (
    <div className={cx('flex flex-row', className)}>
      {[1, 2, 3, 4, 5].map((current) => getStar(current))}
    </div>
  )
}

InlineRating.propTypes = {
  className: PropTypes.string,
  rating: PropTypes.number.isRequired,
}

export default InlineRating
