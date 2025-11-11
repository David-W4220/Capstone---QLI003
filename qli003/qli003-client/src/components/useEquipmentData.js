import { useState, useCallback } from "react"

/**
 * Custom hook for handling API data fetching
 * @param {string} apiUrl - The API endpoint URL
 */
const useEquipmentData = (apiUrl) => {
  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(apiUrl)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      const sortedData = data.sort((a, b) => a.ID - b.ID)
      setEquipment(sortedData)
      setError(null)
    } catch (err) {
      console.error("Could not fetch data:", err)
      setError(err)
      setEquipment([])
    } finally {
      setLoading(false)
    }
  }, [apiUrl])

  return { equipment, loading, error, fetchEquipment }
}

export default useEquipmentData
