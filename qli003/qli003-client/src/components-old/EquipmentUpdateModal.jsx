import React, { useState, useEffect } from 'react';

const EquipmentUpdateModal = ({ equipment, fetchEquipment, API_URL }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [status, setStatus] = useState('');
    const [errors, setErrors] = useState({});

    const selectedItem = selectedId ? equipment.find(item => item.ID === parseInt(selectedId)) : null;

    useEffect(() => {
        if (selectedItem) {
            setNewDescription(selectedItem.Description || '');
            setStatus('');
            setErrors({});
        } else {
            setNewDescription('');
        }
    }, [selectedItem]);

    const validateForm = () => {
        const newErrors = {};
        
        // Description validation
        if (!newDescription.trim()) {
            newErrors.description = 'Description is required';
        } else if (newDescription.length < 3) {
            newErrors.description = 'Description must be at least 3 characters long';
        } else if (newDescription.length > 100) {
            newErrors.description = 'Description must be less than 100 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setStatus('Updating...');

        if (!selectedItem) {
            setStatus('Error: Please select equipment first.');
            return;
        }

        const updatedItem = {
            ...selectedItem,
            Description: newDescription,
        };

        try {
            const response = await fetch(`${API_URL}/update/${selectedItem.ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItem),
            });

            if (response.ok) {
                setStatus('Update successful!');
                await fetchEquipment();
                setTimeout(() => {
                    setModalIsOpen(false);
                    setSelectedId('');
                    setNewDescription('');
                    setStatus('');
                    setErrors({});
                }, 1500);
            } else {
                setStatus('Error updating equipment');
            }
        } catch (error) {
            setStatus(`Error: ${error.message}`);
        }
    };

    if (!modalIsOpen) {
        return (
            <button 
                onClick={() => setModalIsOpen(true)}
                className="w-full py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
            >
                Update Equipment
            </button>
        );
    }

    return (
        <>
            {/* Modal Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setModalIsOpen(false)}
            />

            {/* Modal Content */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                    {/* Modal Header */}
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Update Equipment</h2>
                        <button
                            onClick={() => setModalIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                        >
                            ×
                        </button>
                    </div>

                    {/* Modal Body */}
                    <form onSubmit={handleUpdate} className="p-6 space-y-4">
                        <div>
                            <label htmlFor="equipment-select" className="block text-sm font-medium text-gray-700 mb-2">
                                Select Equipment
                            </label>
                            <select
                                id="equipment-select"
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                value={selectedId}
                                onChange={(e) => setSelectedId(e.target.value)}
                            >
                                <option value="">Select equipment...</option>
                                {equipment.map(item => (
                                    <option key={item.ID} value={item.ID}>
                                        {item.Name} (ID: {item.ID})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="description-input" className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description-input"
                                className={`w-full px-3 py-2 bg-white border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500`}
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                disabled={!selectedId}
                                rows="4"
                                placeholder="Enter equipment description"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {status && (
                            <div className={`p-3 rounded-md text-sm ${status.includes('Error') ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'}`}>
                                {status}
                            </div>
                        )}

                        {/* Modal Footer */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                disabled={!selectedId || !newDescription.trim() || status.includes('Updating')}
                            >
                                {status.includes('Updating') ? 'Updating...' : 'Update'}
                            </button>
                            <button
                                type="button"
                                className="flex-1 py-2.5 px-4 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
                                onClick={() => setModalIsOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EquipmentUpdateModal;