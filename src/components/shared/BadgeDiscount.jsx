import React from 'react'
const BadgeDiscount = ({ value }) => {
  const isNumber = typeof value === 'number' && !isNaN(value)

  return (
    <span className="bg-base-light text-base-dark px-2 py-1 rounded-full">
      {isNumber ? `-${value.toFixed(0)}%` : value}
    </span>
  )
}
export default BadgeDiscount
