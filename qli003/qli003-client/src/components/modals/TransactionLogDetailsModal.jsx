import React from "react"

const TransactionLogDetailsModal = ({ log, isOpen, onClose }) => {
  if (!isOpen || !log) return null

  const parseUserName = (notes) => {
    if (!notes) return "Unknown"
    const match = notes.match(/by:\s*([^-\n]+)/i)
    return match ? match[1].trim() : "Unknown"
  }

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slideUp">
          {/* Modal Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Transaction Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 space-y-3">
          {/* Transaction ID and Equipment ID */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1">
                Transaction ID
              </div>
              <div className="text-sm font-mono text-gray-900">{log.ID}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1">
                Equipment ID
              </div>
              <div className="text-sm text-gray-900">{log.Equipment_ID}</div>
            </div>
          </div>

          {/* Equipment Name */}
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-1">
              Equipment Name
            </div>
            <div className="text-sm font-medium text-gray-900">
              {log.EquipmentName || `Equipment #${log.Equipment_ID}`}
            </div>
          </div>

          {/* Transaction Type and Quantity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1">
                Transaction Type
              </div>
              {log.Check_In ? (
                <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800 border border-green-300">
                  Check In
                </span>
              ) : (
                <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-orange-100 text-orange-800 border border-orange-300">
                  Check Out
                </span>
              )}
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1">
                Quantity Changed
              </div>
              <div className="text-lg font-bold">
                <span className={log.Check_In ? "text-green-600" : "text-red-600"}>
                  {log.Check_In ? "+" : "-"}
                  {Math.abs(log.Quantity_Changed)}
                </span>
              </div>
            </div>
          </div>

          {/* User Name */}
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-1">
              User Name
            </div>
            <div className="text-sm text-gray-900">
              {parseUserName(log.Optional_Notes)}
            </div>
          </div>

          {/* Timestamp */}
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-1">
              Timestamp
            </div>
            <div className="text-sm text-gray-900">
              {new Date(log.Timestamp).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          {/* Notes */}
          {log.Optional_Notes && (
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1">
                Notes
              </div>
              <div className="rounded border border-gray-300 bg-gray-50 p-2 whitespace-pre-wrap text-sm text-gray-900">
                {log.Optional_Notes}
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </>
  )
}

export default TransactionLogDetailsModal
