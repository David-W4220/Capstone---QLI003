import React, { useState, useEffect, useRef } from 'react';

const EquipmentSignOutModal = ({ equipment, isOpen, onClose, onSignOut, API_URL }) => {
    const dialogRef = useRef(null);
    const [selectedId, setSelectedId] = useState('');
    const [userName, setUserName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [isOpen]);

    const selectedItem = selectedId ? equipment.find(item => item.ID === parseInt(selectedId)) : null;

    useEffect(() => {
        if (!isOpen) {
            // Reset form when modal closes
            setSelectedId('');
            setUserName('');
            setQuantity(1);
            setNotes('');
            setErrors({});
            setStatus('');
        }
    }, [isOpen]);

    const validateForm = () => {
        const newErrors = {};
        
        // Name validation
        if (!userName.trim()) {
            newErrors.userName = 'Name is required';
        } else if (userName.length < 2) {
            newErrors.userName = 'Name must be at least 2 characters long';
        } else if (!/^[a-zA-Z\s-]+$/.test(userName)) {
            newErrors.userName = 'Name can only contain letters, spaces, and hyphens';
        }

        // Quantity validation
        if (!quantity || quantity < 1) {
            newErrors.quantity = 'Quantity must be at least 1';
        } else if (selectedItem && quantity > selectedItem.Item_Cnt) {
            newErrors.quantity = 'Quantity cannot exceed available stock';
        }

        // Equipment selection validation
        if (!selectedId) {
            newErrors.equipment = 'Please select an equipment item';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setStatus('Processing...');

        try {
            // Create transaction log entry
            const transaction = {
                Equipment_ID: parseInt(selectedId),
                Check_In: false, // false for sign-out
                Quantity_Changed: quantity,
                Timestamp: new Date().toISOString(),
                Optional_Notes: `Signed out by: ${userName}${notes ? ' - ' + notes : ''}`
            };

            // Add transaction log
            const transactionResponse = await fetch(`${API_URL.replace('Equipment', 'TransactionLog')}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transaction)
            });

            if (transactionResponse.ok) {
                // Update equipment quantity
                const updatedEquipment = {
                    ...selectedItem,
                    Item_Cnt: selectedItem.Item_Cnt - quantity
                };

                const equipmentResponse = await fetch(`${API_URL}/update/${selectedId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedEquipment)
                });

                if (equipmentResponse.ok) {
                    setStatus('Equipment successfully signed out!');
                    setTimeout(() => {
                        onClose();
                        if (onSignOut) onSignOut();
                    }, 1500);
                } else {
                    throw new Error('Failed to update equipment quantity');
                }
            } else {
                throw new Error('Failed to create transaction log');
            }
        } catch (error) {
            setStatus(`Error: ${error.message}`);
        }
    };

    return (
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
                    onClose();
                }
            }}
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Sign Out Equipment</h2>
                <button 
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* User Name Field - Required First */}
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700">Your Name *</label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                            errors.userName ? 'border-red-500' : ''
                        }`}
                        placeholder="Enter your full name"
                    />
                    {errors.userName && (
                        <p className="mt-1 text-sm text-red-600">{errors.userName}</p>
                    )}
                </div>

                {/* Equipment Selection - Disabled until name is entered */}
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700">Select Equipment *</label>
                    <select
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                            errors.equipment ? 'border-red-500' : ''
                        }`}
                        disabled={!userName.trim()}
                    >
                        <option value="">Select equipment...</option>
                        {equipment.map(item => (
                            <option key={item.ID} value={item.ID} disabled={item.Item_Cnt === 0}>
                                {item.Name} (Available: {item.Item_Cnt})
                            </option>
                        ))}
                    </select>
                    {errors.equipment && (
                        <p className="mt-1 text-sm text-red-600">{errors.equipment}</p>
                    )}
                </div>

                {/* Quantity Field - Disabled until equipment is selected */}
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700">Quantity *</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                        min="1"
                        max={selectedItem ? selectedItem.Item_Cnt : 1}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                            errors.quantity ? 'border-red-500' : ''
                        }`}
                        disabled={!selectedId}
                    />
                    {errors.quantity && (
                        <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                    )}
                </div>

                {/* Notes Field - Optional */}
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Optional additional notes"
                        rows="3"
                        disabled={!selectedId}
                    />
                </div>

                {status && (
                    <div className={`p-3 rounded ${
                        status.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                        {status}
                    </div>
                )}

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:bg-gray-300"
                        disabled={!userName.trim() || !selectedId || status === 'Processing...'}
                    >
                        Sign Out Equipment
                    </button>
                </div>
            </form>
        </dialog>
    );
};

export default EquipmentSignOutModal;