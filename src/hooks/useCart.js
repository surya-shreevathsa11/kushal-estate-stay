import { useContext } from 'react'
import { CartContext } from '../context/cartContext.js'

export function useCart() {
  return useContext(CartContext)
}
