import React, { useState, useEffect, useRef } from 'react';

const EquipmentUpdateModal = ({ equipment, fetchEquipment, API_URL }) => {
    const dialogRef = useRef(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [status, setStatus] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (modalIsOpen) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [modalIsOpen]);

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
                fetchEquipment();
                setModalIsOpen(false);
            } else {
                setStatus('Error updating equipment');
            }
        } catch (error) {
            setStatus(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <button 
                onClick={() => setModalIsOpen(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
                Update Equipment
            </button>

            <dialog
                ref={dialogRef}
                className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full"
                onClick={(e) => {
                    const dialogDimensions = e.currentTarget.getBoundingClientRect();
                    if (
                        e.clientX < dialogDimensions.left ||
                        e.clientX > dialogDimensions.right ||
                        e.clientY < dialogDimensions.top ||
                        e.clientY > dialogDimensions.bottom
                    ) {
                        setModalIsOpen(false);
                    }
                }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Update Equipment</h2>
                    <button 
                        onClick={() => setModalIsOpen(false)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>
                <form onSubmit={handleUpdate}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select Equipment:</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={selectedId}
                                onChange={(e) => setSelectedId(e.target.value)}
                            >
                                <option value="">Select equipment...</option>
                                {equipment.map(item => (
                                    <option key={item.ID} value={item.ID}>
                                        {item.Name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description:</label>
                            <textarea
                                className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                                    errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                disabled={!selectedId}
                                rows="4"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {status && (
                            <div className={`p-3 rounded ${
                                status.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                            }`}>
                                {status}
                            </div>
                        )}

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                                onClick={() => setModalIsOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:bg-gray-300"
                                disabled={!selectedId || !newDescription.trim()}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </form>
            </dialog>
        </div>
    );
};

export default EquipmentUpdateModal;