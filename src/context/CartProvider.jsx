import { useCallback, useMemo, useState } from 'react'
import { CartContext } from './cartContext.js'
import { getCart, getGuestToken } from '../services/api.js'

function unwrapCartPayload(data) {
  if (data == null) return null
  if (Array.isArray(data)) return { items: data }
  if (typeof data !== 'object') return null
  const inner =
    data.data && typeof data.data === 'object' && !Array.isArray(data.data)
      ? data.data
      : data
  return inner
}

function extractCartItems(cart) {
  if (!cart) return []
  if (Array.isArray(cart.items)) return cart.items
  if (Array.isArray(cart.roomInfo)) return cart.roomInfo
  if (Array.isArray(cart)) return cart
  return []
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [items, setItems] = useState([])

  const refresh = useCallback(async () => {
    const token = getGuestToken()
    if (!token) {
      setCart(null)
      setItems([])
      return
    }
    try {
      const data = await getCart(token)
      const next = unwrapCartPayload(data)
      setCart(next)
      setItems(extractCartItems(next))
    } catch {
      // API may be offline until the property is live on Vara - keep UI usable.
      setCart(null)
      setItems([])
    }
  }, [])

  const value = useMemo(
    () => ({
      cart,
      items,
      count: items.length,
      refresh,
      setItems,
      setCart,
    }),
    [cart, items, refresh],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
