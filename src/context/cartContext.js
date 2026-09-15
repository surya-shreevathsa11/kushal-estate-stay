import { createContext } from 'react'

export const CartContext = createContext({
  cart: null,
  items: [],
  count: 0,
  refresh: async () => {},
  setItems: () => {},
  setCart: () => {},
})
