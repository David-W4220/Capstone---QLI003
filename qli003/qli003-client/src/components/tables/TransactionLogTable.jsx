import React, { useState, useEffect } from "react"

const TransactionLogTable = ({ logs, loading, onRowClick }) => {
  const [sortOrder, setSortOrder] = useState("desc")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [equipmentNames, setEquipmentNames] = useState({})

  // Fetch equipment names to enrich transaction logs
  useEffect(() => {
    const fetchEquipmentNames = async () => {
      try {
        const response = await fetch('http://localhost:5097/api/Equipment')
        if (response.ok) {
          const equipment = await response.json()
          const namesMap = {}
          equipment.forEach(item => {
            namesMap[item.ID] = item.Name
          })
          setEquipmentNames(namesMap)
        }
      } catch (error) {
        console.error('Error fetching equipment names:', error)
      }
    }

    if (logs.length > 0 && Object.keys(equipmentNames).length === 0) {
      fetchEquipmentNames()
    }
  }, [logs, equipmentNames])

  const parseUserName = (notes) => {
    if (!notes) return "Unknown"
    const match = notes.match(/by:\s*([^-\n]+)/i)
    return match ? match[1].trim() : "Unknown"
  }

  const filteredLogs = logs
    .filter((log) => {
      const matchesSearch =
        log.EquipmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.Optional_Notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parseUserName(log.Optional_Notes).toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFilter =
        filterType === "all" || 
        (filterType === "in" && log.Check_In) || 
        (filterType === "out" && !log.Check_In)

      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      const dateA = new Date(a.Timestamp).getTime()
      const dateB = new Date(b.Timestamp).getTime()
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB
    })

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        Loading transaction logs...
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No transaction logs found
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by equipment name or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Transactions</option>
          <option value="in">Check In</option>
          <option value="out">Check Out</option>
        </select>
        <button
          onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors whitespace-nowrap"
        >
          Sort {sortOrder === "desc" ? "Oldest" : "Newest"}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-300">
        <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipment Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In/Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity Changed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log, index) => {
                const isCheckIn = log.Check_In
                const equipmentName = equipmentNames[log.Equipment_ID] || log.EquipmentName || `Equipment #${log.Equipment_ID}`

                return (
                  <tr
                    key={log.ID}
                    onClick={() => onRowClick && onRowClick({ ...log, EquipmentName: equipmentName })}
                    className="bg-white hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {log.ID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {equipmentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isCheckIn ? (
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800 border border-green-300">
                          Check In
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-orange-100 text-orange-800 border border-orange-300">
                          Check Out
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-semibold ${isCheckIn ? "text-green-600" : "text-red-600"}`}>
                        {isCheckIn ? "+" : "-"}
                        {Math.abs(log.Quantity_Changed)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {parseUserName(log.Optional_Notes)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(log.Timestamp)}
                    </td>
                  </tr>
                )
              })}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No transaction logs found matching your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TransactionLogTable
