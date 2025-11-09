import React, { useState, useEffect } from 'react';

const EquipmentSignOutModal = ({ equipment, isOpen, onClose, onSignOut, API_URL }) => {
    const [selectedId, setSelectedId] = useState('');
    const [userName, setUserName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('');

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
                Condition: 0, // 0 = Good, 1 = Needs_Repair, 2 = Broken
                Optional_Notes: `Signed out by: ${userName}${notes ? ' - ' + notes : ''}`
            };

            // Add transaction log
            const transactionResponse = await fetch(`${API_URL.replace('Equipment', 'Transactionlog')}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transaction)
            });

            if (!transactionResponse.ok) {
                const errorText = await transactionResponse.text();
                console.error('Transaction log error:', errorText);
                throw new Error(`Failed to create transaction log: ${transactionResponse.status} - ${errorText}`);
            }

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

    if (!isOpen) return null;

    return (
        <>
            {/* Modal Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                    {/* Modal Header */}
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">Sign Out Equipment</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                        >
                            ×
                        </button>
                    </div>

                    {/* Modal Body */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* User Name Field - Required First */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className={`w-full px-3 py-2 bg-white border ${errors.userName ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
                                placeholder="Enter your full name"
                            />
                            {errors.userName && (
                                <p className="mt-1 text-sm text-red-600">{errors.userName}</p>
                            )}
                        </div>

                        {/* Equipment Selection - Disabled until name is entered */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Equipment *</label>
                            <select
                                value={selectedId}
                                onChange={(e) => setSelectedId(e.target.value)}
                                className={`w-full px-3 py-2 bg-white border ${errors.equipment ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all disabled:bg-gray-50`}
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                min="1"
                                max={selectedItem ? selectedItem.Item_Cnt : 1}
                                className={`w-full px-3 py-2 bg-white border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all disabled:bg-gray-50`}
                                disabled={!selectedId}
                            />
                            {errors.quantity && (
                                <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                            )}
                        </div>

                        {/* Notes Field - Optional */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all disabled:bg-gray-50"
                                placeholder="Optional additional notes"
                                rows="3"
                                disabled={!selectedId}
                            />
                        </div>

                        {status && (
                            <div className={`p-3 rounded-md text-sm ${
                                status.includes('Error') ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'
                            }`}>
                                {status}
                            </div>
                        )}

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-2.5 px-4 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                disabled={!userName.trim() || !selectedId || status === 'Processing...'}
                            >
                                {status === 'Processing...' ? 'Processing...' : 'Sign Out Equipment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EquipmentSignOutModal;
