import React, { useState, useEffect } from "react"

const EquipmentAddModal = ({ isOpen, onClose, onAdd, API_URL }) => {
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    description: "",
    location: "",
    quantity: 0,
    threshold: 0,
    reorderLink: ""
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState("")

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setNewEquipment({
        name: "",
        description: "",
        location: "",
        quantity: 0,
        threshold: 0,
        reorderLink: ""
      })
      setErrors({})
      setStatus("")
    }
  }, [isOpen])

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors = {}
    
    if (!newEquipment.name.trim()) {
      newErrors.name = 'Equipment name is required'
    } else if (newEquipment.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long'
    }

    if (!newEquipment.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (newEquipment.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative'
    }

    if (newEquipment.threshold < 0) {
      newErrors.threshold = 'Threshold cannot be negative'
    }

    if (newEquipment.reorderLink && !/^https?:\/\/.+/.test(newEquipment.reorderLink)) {
      newErrors.reorderLink = 'Please enter a valid URL (starting with http:// or https://)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddEquipment = async () => {
    if (!validateForm()) {
      return
    }

    setStatus('Adding equipment...')

    try {
      // Prepare equipment data for API
      const equipmentData = {
        Name: newEquipment.name,
        Description: newEquipment.description,
        Item_Cnt: newEquipment.quantity,
        Alpha_Loc: newEquipment.location,
        Threshold: newEquipment.threshold,
        ReodrLk_Pri_Qty: newEquipment.reorderLink,
        BuyQty: null
      }

      const response = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(equipmentData)
      })

      if (response.ok) {
        const addedEquipment = await response.json()
        
        // Create audit log entry for equipment addition
        const auditLog = {
          Admin_ID: 1, // TODO: Replace with actual admin ID when authentication is implemented
          Act_Description: `Added new equipment: ${equipmentData.Name} (ID: ${addedEquipment.ID || 'new'})`,
          Timestamp: new Date().toISOString()
        }

        const API_BASE_URL = API_URL.replace('/Equipment', '')
        await fetch(`${API_BASE_URL}/Auditlog/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(auditLog),
        })

        setStatus('Equipment added successfully!')
        setTimeout(() => {
          onClose()
          if (onAdd) onAdd() // Refresh equipment list
          // Reset form
          setNewEquipment({
            name: "",
            description: "",
            location: "",
            quantity: 0,
            threshold: 0,
            reorderLink: ""
          })
          setStatus("")
        }, 1500)
      } else {
        const errorText = await response.text()
        console.error('Add equipment error:', errorText)
        setStatus('Error adding equipment. Please try again.')
      }
    } catch (error) {
      console.error('Error adding equipment:', error)
      setStatus('Error adding equipment. Please try again.')
    }
  }

  const isFormValid = newEquipment.name && newEquipment.location

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slideUp">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* Add Icon */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Add New Equipment</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Modal Body */}
          <form className="p-6 space-y-4">
            {/* Equipment Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Equipment Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={newEquipment.name}
                onChange={(e) => {
                  setNewEquipment({ ...newEquipment, name: e.target.value })
                  if (errors.name) setErrors({ ...errors, name: '' })
                }}
                className={`w-full px-3 py-2 bg-white border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
                placeholder="Enter equipment name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={newEquipment.description}
                onChange={(e) => setNewEquipment({ ...newEquipment, description: e.target.value })}
                rows="3"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                placeholder="Enter equipment description"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                type="text"
                value={newEquipment.location}
                onChange={(e) => {
                  setNewEquipment({ ...newEquipment, location: e.target.value })
                  if (errors.location) setErrors({ ...errors, location: '' })
                }}
                placeholder="e.g., A-3-2"
                className={`w-full px-3 py-2 bg-white border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                value={newEquipment.quantity}
                onChange={(e) => setNewEquipment({ ...newEquipment, quantity: Number.parseInt(e.target.value) || 0 })}
                min="0"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                placeholder="Enter initial quantity"
              />
            </div>

            {/* Threshold */}
            <div>
              <label htmlFor="threshold" className="block text-sm font-medium text-gray-700 mb-2">
                Low Stock Threshold
              </label>
              <input
                id="threshold"
                type="number"
                value={newEquipment.threshold}
                onChange={(e) => {
                  setNewEquipment({ ...newEquipment, threshold: Number.parseInt(e.target.value) || 0 })
                  if (errors.threshold) setErrors({ ...errors, threshold: '' })
                }}
                min="0"
                className={`w-full px-3 py-2 bg-white border ${errors.threshold ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
                placeholder="Minimum quantity before alert"
              />
              {errors.threshold && (
                <p className="mt-1 text-sm text-red-600">{errors.threshold}</p>
              )}
            </div>

            {/* Reorder Link */}
            <div>
              <label htmlFor="reorderLink" className="block text-sm font-medium text-gray-700 mb-2">
                Reorder Link (Optional)
              </label>
              <input
                id="reorderLink"
                type="url"
                value={newEquipment.reorderLink}
                onChange={(e) => {
                  setNewEquipment({ ...newEquipment, reorderLink: e.target.value })
                  if (errors.reorderLink) setErrors({ ...errors, reorderLink: '' })
                }}
                className={`w-full px-3 py-2 bg-white border ${errors.reorderLink ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
                placeholder="https://vendor.com/product"
              />
              {errors.reorderLink && (
                <p className="mt-1 text-sm text-red-600">{errors.reorderLink}</p>
              )}
            </div>

            {/* Status Message */}
            {status && (
              <div className={`p-3 rounded-md text-sm ${
                status.includes('Error') || status.includes('Failed')
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : status.includes('successfully')
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}>
                {status}
              </div>
            )}

            {/* Footer */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors btn-scale"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddEquipment}
                disabled={!isFormValid || status.includes('Adding')}
                className="flex-1 py-2.5 px-4 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors btn-scale"
              >
                {status.includes('Adding') ? 'Adding...' : 'Add Equipment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default EquipmentAddModal
