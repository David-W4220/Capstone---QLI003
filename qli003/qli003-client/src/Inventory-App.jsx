"use client"

import { useState, useEffect, useCallback } from "react"

const API_BASE_URL = "http://localhost:5097" // Change the API_Base_URL to your hosts IP.
// IE: from localhost to 192.168.X.X or the like
//const API_CONTROLLER = 'QLIDb'; We have 5 controllers now
const HUB_URL = `${API_BASE_URL}/qliHub`
const TABLE_CONTROLLERS = {
  Equipment: "Equipment",
  Admins: "Admins",
  Auditlog: "Auditlog",
  Transactionlog: "Transactionlog",
}

/**
 * EquipmentUpdateForm Component
 * Handles selecting an item and updating its description via a PUT request.
 */
const EquipmentUpdateForm = ({ equipment, fetchEquipment, API_URL }) => {
  const [selectedId, setSelectedId] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [status, setStatus] = useState("")

  const selectedItem = selectedId ? equipment.find((item) => item.ID === Number.parseInt(selectedId)) : null

  useEffect(() => {
    if (selectedItem) {
      setNewDescription(selectedItem.Description || "")
      setStatus("")
    } else {
      setNewDescription("")
    }
  }, [selectedItem])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setStatus("Updating...")

    if (!selectedItem) {
      setStatus("Error: Please select equipment first.")
      return
    }

    const updatedItem = {
      ...selectedItem,
      Description: newDescription,
    }

    try {
      // Use the globally defined API_URL for the PUT request
      const response = await fetch(`${API_URL}/update/${selectedItem.ID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      })

      if (response.status === 204) {
        setStatus(`Successfully updated item ID ${selectedItem.ID}.`)
        setSelectedId("")
        setNewDescription("")
      } else {
        const errorText = await response.text()
        setStatus(`Update failed: HTTP ${response.status}. Details: ${errorText.substring(0, 100)}...`)
      }
    } catch (err) {
      setStatus(`A network error occurred: ${err.message}`)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Update Equipment</h2>
      
      <form onSubmit={handleUpdate} className="space-y-5">
        <div>
          <label htmlFor="equipment-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Equipment
          </label>
          <select
            id="equipment-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            required
          >
            <option value="">Choose an item</option>
            {equipment &&
              equipment.map((item) => (
                <option key={item.ID} value={item.ID}>
                  {item.Name} (ID: {item.ID}) - Stock: {item.Item_Cnt} @ {item.Alpha_Loc}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label htmlFor="description-input" className="block text-sm font-medium text-gray-700 mb-2">
            New Description
          </label>
          <input
            id="description-input"
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500"
            placeholder="Enter new description"
            required
            disabled={!selectedId}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          disabled={!selectedId || status.includes("Updating")}
        >
          Update Description
        </button>
      </form>
      {status && (
        <div className={`mt-4 text-sm ${status.includes("Error") ? "text-red-600" : "text-gray-700"}`}>{status}</div>
      )}
    </div>
  )
}

/**
 * InventoryApp (Main Component)
 * Manages state, data fetching, and SignalR connection.
 */
const InventoryApp = () => {
  //state for which table's currently selected
  const [selectedTable, setSelectedTable] = useState("Equipment")
  //API URL now's Build dynamically based on selection
  const API_URL = `${API_BASE_URL}/api/${selectedTable}`

  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      const sortedData = data.sort((a, b) => a.ID - b.ID)
      setEquipment(sortedData)
    } catch (err) {
      console.error("Could not fetch data:", err)
      setError(err)
      setEquipment([])
    } finally {
      setLoading(false)
    }
  }, [API_URL])

  useEffect(() => {
    fetchEquipment()

    let connection

    const startSignalRConnection = async () => {
      const signalR = window.signalR

      if (!signalR || !signalR.HubConnectionBuilder) {
        console.warn("SignalR library not found globally (window.signalR is undefined). Real-time updates disabled.")
        return
      }

      // --- SignalR Connection Logic ---
      connection = new signalR.HubConnectionBuilder().withUrl(HUB_URL).withAutomaticReconnect().build()

      // 2. Set up the listener BEFORE starting the connection
      connection.on("RefreshData", () => {
        console.log("Refresh signal received. Re-fetching data...")
        fetchEquipment()
      })

      // 3. Start the connection
      try {
        await connection.start()
        console.log("SignalR Connected successfully.")
      } catch (err) {
        console.error("SignalR Connection Start Error:", err)
      }
    }

    startSignalRConnection()

    // 4. Cleanup function: Stop the connection when the component unmounts
    return () => {
      if (connection) {
        connection.stop()
        console.log("SignalR Connection stopped.")
      }
    }
  }, [fetchEquipment])

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800 text-sm">Error fetching data: {error.message}</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Real-Time Equipment Inventory</h1>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all w-full sm:w-auto"
            >
              {Object.keys(TABLE_CONTROLLERS).map((key) => (
                <option key={key} value={TABLE_CONTROLLERS[key]}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Update Form - Left Column */}
          <div className="lg:col-span-1">
            <EquipmentUpdateForm equipment={equipment} fetchEquipment={fetchEquipment} API_URL={API_URL} />
          </div>

          {/* Equipment List - Right Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Equipment List</h2>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-sm text-gray-500">Loading...</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="max-h-[600px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Threshold
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {equipment.map((item) => (
                          <tr key={item.ID} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.ID}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.Name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs break-all">{item.Description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.Item_Cnt}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.Alpha_Loc}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.Threshold}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventoryApp
