import PropTypes from 'prop-types'

import { StarIcon as SolidStar } from '@heroicons/react/solid'
import { StarIcon as OutlineStar } from '@heroicons/react/outline'
import cx from 'classnames'

function InlineRating({ rating, className }) {
  const getStar = (current) => {
    if (rating >= current) {
      return <SolidStar className="h-5 w-5 text-orange-500" key={`${current}-star`} />
    }
    return <OutlineStar className="h-5 w-5 text-warmGray-200" key={`${current}-star`} />
  }

  return (
    <div className={cx('flex flex-row', className)}>
      {[1, 2, 3, 4, 5].map((current) => getStar(current))}
    </div>
  )
}

InlineRating.propTypes = {
  rating: PropTypes.number.isRequired,
  className: PropTypes.string,
}

export default InlineRating
