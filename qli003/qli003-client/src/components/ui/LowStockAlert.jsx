import React from "react"

const LowStockAlert = ({ lowStockCount, onViewLowStock }) => {
  if (lowStockCount <= 0) return null

  return (
    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <svg 
          className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="text-sm text-red-800">
            <strong>{lowStockCount}</strong> item(s) are low or out of stock and need attention!
          </span>
          <button
            onClick={onViewLowStock}
            className="px-3 py-1.5 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
          >
            View Low Stock Items
          </button>
        </div>
      </div>
    </div>
  )
}

export default LowStockAlert
