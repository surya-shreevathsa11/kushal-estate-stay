import { createContext } from 'react'

export const CartContext = createContext({
  items: [],
  count: 0,
  refresh: async () => {},
  setItems: () => {},
})
