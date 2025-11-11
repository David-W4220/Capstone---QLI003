import React from "react"

const DashboardStats = ({ equipment, lowStockCount, onViewLowStock }) => {
  // Calculate total quantity across all equipment
  const totalQuantity = equipment.reduce((sum, item) => sum + (item.Item_Cnt || 0), 0)

  return (
    <>
      {/* Low Stock Alert */}
      {lowStockCount > 0 && (
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
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {/* Total Items Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-2xl font-bold text-gray-900" data-testid="total-equipment">
            {equipment.length}
          </div>
          <div className="text-sm text-gray-600 mt-1">Total Items</div>
        </div>

        {/* Low Stock Alerts Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div 
            className={`text-2xl font-bold ${lowStockCount > 0 ? 'text-red-600' : 'text-gray-900'}`}
            data-testid="low-stock-count"
          >
            {lowStockCount}
          </div>
          <div className="text-sm text-gray-600 mt-1">Low Stock Alerts</div>
        </div>

        {/* Total Quantity Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-2xl font-bold text-gray-900">
            {totalQuantity}
          </div>
          <div className="text-sm text-gray-600 mt-1">Total Quantity</div>
        </div>
      </div>
    </>
  )
}

export default DashboardStats
