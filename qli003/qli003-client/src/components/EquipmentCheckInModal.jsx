import React, { useState } from "react"

const EquipmentCheckInModal = ({ isOpen, onClose, equipment, onCheckIn }) => {
  const [quantity, setQuantity] = useState(1)

  if (!isOpen || !equipment) return null

  const handleSubmit = () => {
    if (quantity > 0) {
      onCheckIn(quantity)
      setQuantity(1)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-900">Check In Equipment</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Checking in: <strong className="text-gray-900">{equipment.Name}</strong>
          </p>

          {/* Form */}
          <div className="py-4">
            <label htmlFor="checkin-qty" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity to Check In
            </label>
            <input
              id="checkin-qty"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={quantity <= 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Check In
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EquipmentCheckInModal
