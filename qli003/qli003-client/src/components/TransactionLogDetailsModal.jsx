import React from "react"

const TransactionLogDetailsModal = ({ log, isOpen, onClose }) => {
  if (!isOpen || !log) return null

  const parseUserName = (notes) => {
    if (!notes) return "Unknown"
    const match = notes.match(/by:\s*([^-\n]+)/i)
    return match ? match[1].trim() : "Unknown"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Transaction Log Details
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Complete information for transaction #{log.ID}
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {/* Transaction ID and Equipment ID */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-1">
                Transaction ID
              </div>
              <div className="text-lg font-mono text-gray-900">{log.ID}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-1">
                Equipment ID
              </div>
              <div className="text-lg text-gray-900">{log.Equipment_ID}</div>
            </div>
          </div>

          {/* Equipment Name */}
          <div>
            <div className="text-sm font-semibold text-gray-600 mb-2">
              Equipment Name
            </div>
            <div className="text-lg font-medium text-gray-900">
              {log.EquipmentName || `Equipment #${log.Equipment_ID}`}
            </div>
          </div>

          {/* Transaction Type and Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-2">
                Transaction Type
              </div>
              {log.Check_In ? (
                <span className="inline-block px-3 py-1 text-sm font-semibold rounded bg-green-100 text-green-800 border border-green-300">
                  Check In
                </span>
              ) : (
                <span className="inline-block px-3 py-1 text-sm font-semibold rounded bg-orange-100 text-orange-800 border border-orange-300">
                  Check Out
                </span>
              )}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-2">
                Quantity Changed
              </div>
              <div className="text-2xl font-bold">
                <span className={log.Check_In ? "text-green-600" : "text-red-600"}>
                  {log.Check_In ? "+" : "-"}
                  {Math.abs(log.Quantity_Changed)}
                </span>
              </div>
            </div>
          </div>

          {/* User Name */}
          <div>
            <div className="text-sm font-semibold text-gray-600 mb-2">
              User Name
            </div>
            <div className="text-lg text-gray-900">
              {parseUserName(log.Optional_Notes)}
            </div>
          </div>

          {/* Timestamp */}
          <div>
            <div className="text-sm font-semibold text-gray-600 mb-2">
              Timestamp
            </div>
            <div className="text-lg text-gray-900">
              {new Date(log.Timestamp).toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
          </div>

          {/* Notes */}
          {log.Optional_Notes && (
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-2">
                Notes
              </div>
              <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 whitespace-pre-wrap text-gray-900">
                {log.Optional_Notes}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransactionLogDetailsModal
