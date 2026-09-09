import { useCallback, useMemo, useState } from 'react'
import { CartContext } from './cartContext.js'
import { getCart, getGuestToken } from '../services/api.js'

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const refresh = useCallback(async () => {
    const token = getGuestToken()
    if (!token) {
      setItems([])
      return
    }
    try {
      const data = await getCart(token)
      const list =
        data && typeof data === 'object' && Array.isArray(data.items)
          ? data.items
          : Array.isArray(data)
            ? data
            : []
      setItems(list)
    } catch {
      // API may be offline until Sathwik wires the property - keep UI usable.
      setItems([])
    }
  }, [])

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      refresh,
      setItems,
    }),
    [items, refresh],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
