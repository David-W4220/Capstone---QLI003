"use client"

import { useState, useEffect, useCallback } from "react"
import EquipmentUpdateModal from "./components-new/EquipmentUpdateModal"
import EquipmentDetailsModal from "./components-new/EquipmentDetailsModal"
import EquipmentSignOutModal from "./components-new/EquipmentSignOutModal"

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
  
  // Modal states
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [signOutModalOpen, setSignOutModalOpen] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState(null)

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

  // GENERATE REPORT BUTTON
  const REPORT_API_URL = `${API_BASE_URL}/api/report/send`
  const [reportStatus, setReportStatus] = useState("")
  const handleGenerateReport = async () => {
    setReportStatus("Generating report and sending email...")

    try {
      const response = await fetch(REPORT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      const data = await response.json()

      setReportStatus(data.message)
    } catch (err) {
      setReportStatus(`Somethings wrong: ${err.message}`)
    }

    setTimeout(() => setReportStatus(""), 8000)
  }

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
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              >
                {Object.keys(TABLE_CONTROLLERS).map((key) => (
                  <option key={key} value={TABLE_CONTROLLERS[key]}>
                    {key}
                  </option>
                ))}
              </select>
              <button
                onClick={handleGenerateReport}
                disabled={reportStatus.includes("Generating")}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {reportStatus.includes("Generating") ? "Generating..." : "Generate History Report"}
              </button>
            </div>
          </div>
          {reportStatus && (
            <div
              className={`px-4 py-3 rounded-md text-sm font-medium ${
                reportStatus.includes("failed") || reportStatus.includes("wrong")
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-blue-50 text-blue-800 border border-blue-200"
              }`}
            >
              {reportStatus}
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Action Buttons - Left Column */}
          <div className="lg:col-span-1 space-y-4">
            <EquipmentUpdateModal equipment={equipment} fetchEquipment={fetchEquipment} API_URL={API_URL} />
            <button 
              onClick={() => setSignOutModalOpen(true)}
              className="w-full py-2.5 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors"
            >
              Check Out Equipment
            </button>
          </div>

          {/* Data List - Right Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedTable === 'Equipment' && 'Equipment List'}
                  {selectedTable === 'Admins' && 'Administrators'}
                  {selectedTable === 'Auditlog' && 'Audit Log'}
                  {selectedTable === 'Transactionlog' && 'Transaction Log'}
                </h2>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-sm text-gray-500">Loading...</div>
                </div>
              ) : equipment.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-sm text-gray-500">No data available</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="max-h-[600px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          {selectedTable === 'Equipment' ? (
                            <>
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
                            </>
                          ) : (
                            Object.keys(equipment[0]).map((key) => (
                              <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {key.replace(/_/g, ' ')}
                              </th>
                            ))
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {equipment.map((item, index) => (
                          <tr 
                            key={item.ID || index} 
                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => {
                              if (selectedTable === 'Equipment') {
                                setSelectedEquipment(item);
                                setDetailsModalOpen(true);
                              }
                            }}
                          >
                            {selectedTable === 'Equipment' ? (
                              <>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.ID}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.Name}</td>
                                <td className="px-4 py-4 text-sm text-gray-600 max-w-[150px] truncate" title={item.Description}>
                                  {item.Description}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {item.Item_Cnt}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.Alpha_Loc}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.Threshold}</td>
                              </>
                            ) : (
                              Object.entries(item).map(([key, value]) => {
                                const isLongText = key === 'Optional_Notes' || key === 'Description';
                                const displayValue = value !== null && value !== undefined 
                                  ? (typeof value === 'boolean' 
                                      ? (value ? 'Yes' : 'No')
                                      : (key === 'Timestamp' || key.includes('Date')
                                          ? new Date(value).toLocaleString()
                                          : String(value)))
                                  : '-';
                                
                                return (
                                  <td 
                                    key={key} 
                                    className={`px-6 py-4 text-sm text-gray-900 ${isLongText ? 'max-w-xs truncate' : 'whitespace-nowrap'}`}
                                    title={isLongText ? displayValue : ''}
                                  >
                                    {displayValue}
                                  </td>
                                );
                              })
                            )}
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

        {/* Modals */}
        <EquipmentDetailsModal 
          equipment={selectedEquipment}
          isOpen={detailsModalOpen}
          onClose={() => {
            setDetailsModalOpen(false);
            setSelectedEquipment(null);
          }}
        />
        
        <EquipmentSignOutModal 
          equipment={equipment}
          isOpen={signOutModalOpen}
          onClose={() => setSignOutModalOpen(false)}
          onSignOut={fetchEquipment}
          API_URL={API_URL}
        />
      </div>
    </div>
  )
}

export default InventoryApp
