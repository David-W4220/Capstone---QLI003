import React, { useState, useEffect } from "react"

const EquipmentAddModal = ({ isOpen, onClose, onAdd, API_URL, adminId }) => {
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

  // HELPER: Generates a fresh local timestamp in YYYY-MM-DDTHH:MM:SS format
  const getFreshLocalTimestamp = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now - offset).toISOString().slice(0, 19);
  };

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
        BuyQty: null,
        IsDeleted: false // Soft delete flag
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
        
        // Capture the time at the exact moment the addition succeeded
        const freshTimestamp = getFreshLocalTimestamp();

        // Create audit log entry using the passed adminId prop and fresh timestamp
        const auditLog = {
          Admin_ID: adminId || 1, 
          Act_Description: `Added new equipment: ${equipmentData.Name} (ID: ${addedEquipment.ID || addedEquipment.id || 'new'})`,
          Timestamp: freshTimestamp
        }

        // Clean up API_BASE_URL logic
        const API_BASE_URL = API_URL.toLowerCase().endsWith('/equipment') 
          ? API_URL.substring(0, API_URL.length - 10) 
          : API_URL.replace('/Equipment', '');

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
          if (onAdd) onAdd()
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
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
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

          <form className="p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">
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
                className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none`}
                placeholder="Enter equipment name"
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={newEquipment.description}
                onChange={(e) => setNewEquipment({ ...newEquipment, description: e.target.value })}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Brief description..."
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-bold text-gray-700 mb-1">
                Shelf Location <span className="text-red-500">*</span>
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
                className={`w-full px-3 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none`}
              />
              {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-bold text-gray-700 mb-1">
                  Initial Qty
                </label>
                <input
                  id="quantity"
                  type="number"
                  value={newEquipment.quantity}
                  onChange={(e) => setNewEquipment({ ...newEquipment, quantity: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label htmlFor="threshold" className="block text-sm font-bold text-gray-700 mb-1">
                  Threshold
                </label>
                <input
                  id="threshold"
                  type="number"
                  value={newEquipment.threshold}
                  onChange={(e) => setNewEquipment({ ...newEquipment, threshold: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reorderLink" className="block text-sm font-bold text-gray-700 mb-1">
                Reorder URL (Optional)
              </label>
              <input
                id="reorderLink"
                type="url"
                value={newEquipment.reorderLink}
                onChange={(e) => setNewEquipment({ ...newEquipment, reorderLink: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="https://..."
              />
            </div>

            {status && (
              <div className={`p-3 rounded-md text-xs font-bold ${
                status.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
              }`}>
                {status}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 bg-white text-gray-700 text-sm font-bold rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddEquipment}
                disabled={!isFormValid || status.includes('Adding')}
                className="flex-1 py-2 px-4 bg-green-600 text-white text-sm font-bold rounded-md hover:bg-green-700 disabled:bg-gray-300 transition-colors"
              >
                {status.includes('Adding') ? 'Adding...' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default EquipmentAddModal