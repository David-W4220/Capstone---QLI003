import React from "react"

const EquipmentTableWithActions = ({ 
  equipment, 
  onCheckout, 
  onCheckin, 
  onEdit, 
  onDelete,
  onRowClick
}) => {
  const getStatusBadge = (item) => {
    const stock = item.Item_Cnt || 0
    const threshold = item.Threshold || 0

    if (stock === 0) {
      return <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800">Out of Stock</span>
    } else if (stock <= threshold) {
      return <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800">Low Stock</span>
    } else {
      return <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">Available</span>
    }
  }

  if (equipment.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No equipment found
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Threshold
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {equipment.map((item, index) => (
            <tr 
              key={item.ID} 
              onClick={() => onRowClick && onRowClick(item)}
              className={`${index % 2 === 0 ? 'bg-white' : 'bg-white-50'} hover:bg-gray-100 transition-colors cursor-pointer`}
            >
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{item.Name}</div>
                <div className="text-sm text-gray-500 max-w-[150px] truncate" title={item.Description}>
                  {item.Description}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.Alpha_Loc}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.Item_Cnt}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.Threshold}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(item)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onCheckout(item)
                    }}
                    className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded hover:bg-gray-800 transition-colors btn-scale"
                  >
                    Check Out
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onCheckin(item)
                    }}
                    className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50 transition-colors btn-scale"
                  >
                    Check In
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(item)
                    }}
                    className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50 transition-colors btn-scale"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(item)
                    }}
                    className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors btn-scale"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default EquipmentTableWithActions
