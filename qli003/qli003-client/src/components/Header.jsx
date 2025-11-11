import React from "react"

const Header = ({ 
  selectedTable, 
  onTableChange, 
  onGenerateReport, 
  reportStatus, 
  tableControllers 
}) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Real-Time Equipment Inventory</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            value={selectedTable}
            onChange={(e) => onTableChange(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          >
            {Object.keys(tableControllers).map((key) => (
              <option key={key} value={tableControllers[key]}>
                {key}
              </option>
            ))}
          </select>
          <button
            onClick={onGenerateReport}
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
  )
}

export default Header
