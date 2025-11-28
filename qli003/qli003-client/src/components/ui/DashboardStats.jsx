import React from "react"

const DashboardStats = ({ equipment, lowStockCount }) => {
  // Calculate total quantity across all equipment
  const totalQuantity = equipment.reduce((sum, item) => sum + (item.Item_Cnt || 0), 0)

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
        {/* Total Items Card */}
        <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900" data-testid="total-equipment">
                {equipment.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Items</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts Card */}
        <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div 
                className={`text-2xl font-bold ${lowStockCount > 0 ? 'text-red-600' : 'text-gray-900'}`}
                data-testid="low-stock-count"
              >
                {lowStockCount}
              </div>
              <div className="text-sm text-gray-600 mt-1">Low Stock Alerts</div>
            </div>
            <div className={`p-3 rounded-lg ${lowStockCount > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
              <svg className={`h-6 w-6 ${lowStockCount > 0 ? 'text-red-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Quantity Card */}
        <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {totalQuantity}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Quantity</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
        </div>
    </div>
  )
}

export default DashboardStats
