import React from "react"

const AuditLogDetailsModal = ({ log, isOpen, onClose }) => {
  if (!isOpen || !log) return null

  const getActionType = (action) => {
    const actionLower = action.toLowerCase()
    if (actionLower.includes("add") || actionLower.includes("create")) return "add"
    if (actionLower.includes("update") || actionLower.includes("edit") || actionLower.includes("modify"))
      return "update"
    if (actionLower.includes("delete") || actionLower.includes("remove")) return "delete"
    return "other"
  }

  const actionType = getActionType(log.Act_Description)

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Audit Log Details</h2>
              <p className="text-sm text-gray-600 mt-1">Complete information for audit log entry #{log.ID}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-4">
            {/* ID and Admin ID Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">Log ID</div>
                <div className="text-lg font-mono text-gray-900">{log.ID}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">Admin ID</div>
                <div className="text-lg text-gray-900">{log.Admin_ID}</div>
              </div>
            </div>

            {/* Action Type Badge */}
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-2">Action Type</div>
              {actionType === "add" && (
                <span className="inline-block px-3 py-1 text-sm font-semibold rounded-md bg-green-100 text-green-800 border border-green-300">
                  ADD
                </span>
              )}
              {actionType === "update" && (
                <span className="inline-block px-3 py-1 text-sm font-semibold rounded-md bg-blue-100 text-blue-800 border border-blue-300">
                  UPDATE
                </span>
              )}
              {actionType === "delete" && (
                <span className="inline-block px-3 py-1 text-sm font-semibold rounded-md bg-red-100 text-red-800 border border-red-300">
                  DELETE
                </span>
              )}
              {actionType === "other" && (
                <span className="inline-block px-3 py-1 text-sm font-semibold rounded-md bg-gray-100 text-gray-800 border border-gray-300">
                  OTHER
                </span>
              )}
            </div>

            {/* Action Description */}
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-2">Action Description</div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-900">
                {log.Act_Description}
              </div>
            </div>

            {/* Timestamp */}
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-2">Timestamp</div>
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
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AuditLogDetailsModal
