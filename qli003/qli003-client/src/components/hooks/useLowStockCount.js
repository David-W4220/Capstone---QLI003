import { useMemo } from "react"

/**
 * Custom hook to calculate low stock count
 * @param {Array} equipment - Array of equipment objects
 * @returns {number} Count of items below threshold
 */
const useLowStockCount = (equipment) => {
  const lowStockCount = useMemo(() => {
    return equipment.filter(item => {
      const stock = item.Item_Cnt || 0
      const threshold = item.Threshold || 0
      return stock <= threshold
    }).length
  }, [equipment])

  return lowStockCount
}

export default useLowStockCount
