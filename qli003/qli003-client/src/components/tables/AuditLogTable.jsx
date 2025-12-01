import React, { useState, useEffect } from "react"

const AuditLogTable = ({ logs, loading, onRowClick }) => {
  const [sortOrder, setSortOrder] = useState("desc")
  const [searchTerm, setSearchTerm] = useState("")
  const [adminNames, setAdminNames] = useState({})

  // Fetch admin names to enrich audit logs
  useEffect(() => {
    const fetchAdminNames = async () => {
      try {
        const response = await fetch('http://localhost:5097/api/Admins')
        if (response.ok) {
          const admins = await response.json()
          const namesMap = {}
          admins.forEach(admin => {
            namesMap[admin.ID] = admin.Name || `Admin ${admin.ID}`
          })
          setAdminNames(namesMap)
        }
      } catch (error) {
        console.error('Error fetching admin names:', error)
      }
    }

    if (logs.length > 0 && Object.keys(adminNames).length === 0) {
      fetchAdminNames()
    }
  }, [logs, adminNames])

  const getActionType = (action) => {
    if (!action) return "other"
    const actionLower = action.toLowerCase()
    if (actionLower.includes("add") || actionLower.includes("create")) return "add"
    if (actionLower.includes("update") || actionLower.includes("edit") || actionLower.includes("modify"))
      return "update"
    if (actionLower.includes("delete") || actionLower.includes("remove")) return "delete"
    return "other"
  }

  const getActionBadge = (action) => {
    const actionType = getActionType(action)
    
    if (actionType === "add") {
      return <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800 border border-green-300">ADD</span>
    }
    if (actionType === "update") {
      return <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 border border-blue-300">UPDATE</span>
    }
    if (actionType === "delete") {
      return <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800 border border-red-300">DELETE</span>
    }
    return <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800 border border-gray-300">OTHER</span>
  }

  const filteredLogs = logs
    .filter(
      (log) => {
        const adminName = adminNames[log.Admin_ID] || ""
        return (
          log.Act_Description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.Admin_ID?.toString().includes(searchTerm)
        )
      }
    )
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

  const getRowClass = () => {
    return "bg-white hover:bg-gray-100"
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        Loading audit logs...
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No audit logs found
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Sort Controls */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
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
            placeholder="Search by admin ID or action..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
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
                  Admin ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log, index) => (
                <tr
                  key={log.ID}
                  onClick={() => onRowClick && onRowClick(log)}
                  className={`${getRowClass()} transition-colors cursor-pointer`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {log.ID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {adminNames[log.Admin_ID] || `Admin ${log.Admin_ID}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      {getActionBadge(log.Act_Description)}
                      <span className="truncate max-w-md" title={log.Act_Description}>
                        {log.Act_Description}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(log.Timestamp)}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No audit logs found matching your search
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

export default AuditLogTable
