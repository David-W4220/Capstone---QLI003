import React from "react"

const EquipmentTable = ({ 
  selectedTable, 
  equipment, 
  loading, 
  onRowClick 
}) => {
  const getTableTitle = () => {
    switch(selectedTable) {
      case 'Equipment': return 'Equipment List'
      case 'Admins': return 'Administrators'
      case 'Auditlog': return 'Audit Log'
      case 'Transactionlog': return 'Transaction Log'
      default: return 'Data List'
    }
  }

  if (loading) {
    return (
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{getTableTitle()}</h2>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-sm text-gray-500">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  if (equipment.length === 0) {
    return (
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{getTableTitle()}</h2>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-sm text-gray-500">No data available</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{getTableTitle()}</h2>
        </div>
        <div className="overflow-x-auto">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {selectedTable === 'Equipment' ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Threshold
                      </th>
                    </>
                  ) : (
                    Object.keys(equipment[0]).map((key) => (
                      <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {key.replace(/_/g, ' ')}
                      </th>
                    ))
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {equipment.map((item, index) => (
                  <tr 
                    key={item.ID || index} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => onRowClick(item)}
                  >
                    {selectedTable === 'Equipment' ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.ID}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.Name}</td>
                        <td className="px-4 py-4 text-sm text-gray-600 max-w-[150px] truncate" title={item.Description}>
                          {item.Description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.Item_Cnt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.Alpha_Loc}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.Threshold}</td>
                      </>
                    ) : (
                      Object.entries(item).map(([key, value]) => {
                        const isLongText = key === 'Optional_Notes' || key === 'Description';
                        const displayValue = value !== null && value !== undefined 
                          ? (typeof value === 'boolean' 
                              ? (value ? 'Yes' : 'No')
                              : (key === 'Timestamp' || key.includes('Date')
                                  ? new Date(value).toLocaleString()
                                  : String(value)))
                          : '-';
                        
                        return (
                          <td 
                            key={key} 
                            className={`px-6 py-4 text-sm text-gray-900 ${isLongText ? 'max-w-xs truncate' : 'whitespace-nowrap'}`}
                            title={isLongText ? displayValue : ''}
                          >
                            {displayValue}
                          </td>
                        );
                      })
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EquipmentTable
