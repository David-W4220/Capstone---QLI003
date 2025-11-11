import React, { useState, useEffect } from "react"

const EquipmentEditModal = ({ isOpen, onClose, equipment, onSave }) => {
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    Location: "",
    Threshold: "",
    VendorLink: ""
  })

  useEffect(() => {
    if (equipment) {
      setFormData({
        Name: equipment.Name || "",
        Description: equipment.Description || "",
        Location: equipment.Location || "",
        Threshold: equipment.Threshold || "",
        VendorLink: equipment.VendorLink || ""
      })
    }
  }, [equipment])

  if (!isOpen || !equipment) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-900">Edit Equipment</h2>
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
            Editing: <strong className="text-gray-900">{equipment.Name}</strong>
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Equipment Name */}
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                Equipment Name <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-name"
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter equipment name"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="edit-description"
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter equipment description"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="edit-location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                id="edit-location"
                type="text"
                name="Location"
                value={formData.Location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter storage location"
              />
            </div>

            {/* Threshold */}
            <div>
              <label htmlFor="edit-threshold" className="block text-sm font-medium text-gray-700 mb-1">
                Low Stock Threshold
              </label>
              <input
                id="edit-threshold"
                type="number"
                name="Threshold"
                value={formData.Threshold}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter minimum quantity threshold"
              />
            </div>

            {/* Vendor Link */}
            <div>
              <label htmlFor="edit-vendor" className="block text-sm font-medium text-gray-700 mb-1">
                Vendor Link
              </label>
              <input
                id="edit-vendor"
                type="url"
                name="VendorLink"
                value={formData.VendorLink}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://vendor.com/product"
              />
            </div>

            {/* Footer */}
            <div className="flex gap-3 mt-6 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EquipmentEditModal
