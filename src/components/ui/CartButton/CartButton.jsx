import React from 'react'
import { FiShoppingCart } from 'react-icons/fi'

const CartButton = ({ itemslength, item }) => {
  return (
    <div className="flex text-sm items-center font-semibold rounded-full p-2 gap-2 bg-base-coffe">
      <FiShoppingCart className="text-xl" />
      {itemslength} {item}
    </div>
  )
}

export default CartButton
