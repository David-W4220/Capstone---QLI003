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
        className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slideUp">
          {/* Modal Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Audit Log Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 space-y-3">
            {/* ID and Admin ID Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-semibold text-gray-600 mb-1">Log ID</div>
                <div className="text-sm font-mono text-gray-900">{log.ID}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-600 mb-1">Admin ID</div>
                <div className="text-sm text-gray-900">{log.Admin_ID}</div>
              </div>
            </div>

            {/* Action Type Badge */}
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1">Action Type</div>
              {actionType === "add" && (
                <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800 border border-green-300">
                  ADD
                </span>
              )}
              {actionType === "update" && (
                <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 border border-blue-300">
                  UPDATE
                </span>
              )}
              {actionType === "delete" && (
                <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800 border border-red-300">
                  DELETE
                </span>
              )}
              {actionType === "other" && (
                <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800 border border-gray-300">
                  OTHER
                </span>
              )}
            </div>

            {/* Action Description */}
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1">Action Description</div>
              <div className="rounded border border-gray-200 bg-gray-50 p-2 text-sm text-gray-900">
                {log.Act_Description}
              </div>
            </div>

            {/* Timestamp */}
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1">Timestamp</div>
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
          </div>
        </div>
      </div>
    </>
  )
}

export default AuditLogDetailsModal
