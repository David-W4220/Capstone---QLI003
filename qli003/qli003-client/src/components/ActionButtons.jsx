import React from "react"

const ActionButtons = ({ onCheckOut, EquipmentUpdateModal, equipment, fetchEquipment, apiUrl }) => {
  return (
    <div className="lg:col-span-1 space-y-4">
      <EquipmentUpdateModal equipment={equipment} fetchEquipment={fetchEquipment} API_URL={apiUrl} />
      <button 
        onClick={onCheckOut}
        className="w-full py-2.5 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors"
      >
        Check Out Equipment
      </button>
    </div>
  )
}

export default ActionButtons
