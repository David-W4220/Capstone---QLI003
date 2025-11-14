import { useState, useMemo } from "react"

/**
 * Custom hook for filtering and searching equipment
 * @param {Array} equipment - Array of equipment objects
 */
const useEquipmentFilter = (equipment) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterLocation, setFilterLocation] = useState("all")

  // Filter equipment based on search term and filters
  const filteredEquipment = useMemo(() => {
    let filtered = [...equipment]

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(item => {
        const name = (item.Name || '').toLowerCase()
        const description = (item.Description || '').toLowerCase()
        const location = (item.Alpha_Loc || '').toLowerCase()
        
        return name.includes(search) || 
               description.includes(search) || 
               location.includes(search)
      })
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(item => {
        const stock = item.Item_Cnt || 0
        const threshold = item.Threshold || 0

        switch (filterStatus) {
          case "available":
            return stock > threshold
          case "low":
            return stock > 0 && stock <= threshold
          case "out":
            return stock === 0
          default:
            return true
        }
      })
    }

    // Apply location filter
    if (filterLocation !== "all") {
      filtered = filtered.filter(item => item.Alpha_Loc === filterLocation)
    }

    return filtered
  }, [equipment, searchTerm, filterStatus, filterLocation])

  return {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterLocation,
    setFilterLocation,
    filteredEquipment
  }
}

export default useEquipmentFilter
