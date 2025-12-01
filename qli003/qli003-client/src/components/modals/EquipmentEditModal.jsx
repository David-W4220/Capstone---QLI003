import React, { useState, useEffect } from "react"

const EquipmentEditModal = ({ isOpen, onClose, equipment, onSave }) => {
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    Location: "",
    Threshold: "",
    ReorderLink: ""
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState("")

  useEffect(() => {
    if (equipment) {
      setFormData({
        Name: equipment.Name || "",
        Description: equipment.Description || "",
        Location: equipment.Alpha_Loc || "",
        Threshold: equipment.Threshold || "",
        ReorderLink: equipment.ReodrLk_Pri_Qty || ""
      })
      setErrors({})
      setStatus("")
    }
  }, [equipment])

  useEffect(() => {
    if (!isOpen) {
      setErrors({})
      setStatus("")
    }
  }, [isOpen])

  if (!isOpen || !equipment) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.Name.trim()) {
      newErrors.Name = 'Equipment name is required'
    } else if (formData.Name.length < 2) {
      newErrors.Name = 'Name must be at least 2 characters long'
    }

    if (formData.Threshold && parseInt(formData.Threshold) < 0) {
      newErrors.Threshold = 'Threshold cannot be negative'
    }

    if (formData.ReorderLink && !/^https?:\/\/.+/.test(formData.ReorderLink)) {
      newErrors.ReorderLink = 'Please enter a valid URL (starting with http:// or https://)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setStatus('Updating...')
    
    try {
      await onSave(formData)
      setStatus('Equipment updated successfully!')
      setTimeout(() => {
        setStatus('')
      }, 1500)
    } catch (error) {
      setStatus('Error updating equipment')
      console.error('Update error:', error)
    }
  }

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
              {/* Edit Icon */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Edit Equipment</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Equipment Name */}
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">
                Equipment Name <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-name"
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-white border ${errors.Name ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
                placeholder="Enter equipment name"
              />
              {errors.Name && (
                <p className="mt-1 text-sm text-red-600">{errors.Name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="edit-description"
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                placeholder="Enter equipment description"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="edit-location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                id="edit-location"
                type="text"
                name="Location"
                value={formData.Location}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                placeholder="Enter storage location"
              />
            </div>

            {/* Threshold */}
            <div>
              <label htmlFor="edit-threshold" className="block text-sm font-medium text-gray-700 mb-2">
                Low Stock Threshold
              </label>
              <input
                id="edit-threshold"
                type="number"
                name="Threshold"
                value={formData.Threshold}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 bg-white border ${errors.Threshold ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
                placeholder="Enter minimum quantity threshold"
              />
              {errors.Threshold && (
                <p className="mt-1 text-sm text-red-600">{errors.Threshold}</p>
              )}
            </div>

            {/* Reorder Link */}
            <div>
              <label htmlFor="edit-reorder" className="block text-sm font-medium text-gray-700 mb-2">
                Reorder Link
              </label>
              <input
                id="edit-reorder"
                type="url"
                name="ReorderLink"
                value={formData.ReorderLink}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-white border ${errors.ReorderLink ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
                placeholder="https://vendor.com/product"
              />
              {errors.ReorderLink && (
                <p className="mt-1 text-sm text-red-600">{errors.ReorderLink}</p>
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
                type="submit"
                disabled={status.includes('Updating')}
                className="flex-1 py-2.5 px-4 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors btn-scale"
              >
                {status.includes('Updating') ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default EquipmentEditModal
