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
      <div className="mb-6 flex items-center gap-4">
        <label htmlFor="view-selector" className="text-sm font-medium text-gray-700">
          View:
        </label>
        <select
          id="view-selector"
          value={selectedTable}
          onChange={(e) => onTableChange(e.target.value)}
          className="w-[200px] px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        >
          {Object.keys(tableControllers).map((key) => (
            <option key={key} value={tableControllers[key]}>
              {key}
            </option>
          ))}
        </select>
      </div>
      {selectedTable === 'Auditlog' && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Audit Log</h2>
          <p className="text-gray-600">Track all system changes and administrative actions</p>
        </div>
      )}
      {selectedTable === 'Transactionlog' && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Transaction Log</h2>
          <p className="text-gray-600">View all equipment check-ins and check-outs</p>
        </div>
      )}
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
