import React, { useState, useEffect } from 'react';

const EquipmentCheckOutModal = ({ selectedEquipment, isOpen, onClose, onSignOut, API_URL, adminId }) => {
    const [userName, setUserName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (!isOpen) {
            // Reset form when modal closes
            setUserName('');
            setQuantity(1);
            setNotes('');
            setErrors({});
            setStatus('');
        }
    }, [isOpen]);

    // HELPER: Generates a fresh local timestamp in YYYY-MM-DDTHH:MM:SS format
    const getFreshLocalTimestamp = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        return new Date(now - offset).toISOString().slice(0, 19);
    };

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
        } else if (selectedEquipment && quantity > selectedEquipment.Item_Cnt) {
            newErrors.quantity = 'Quantity cannot exceed available stock';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm() || !selectedEquipment) {
            return;
        }

        setStatus('Processing...');

        try {
            // Generate a fresh local timestamp at the moment of submission
            const currentTimestamp = getFreshLocalTimestamp();

            // Create transaction log entry
            const transaction = {
                Equipment_ID: selectedEquipment.ID,
                Check_In: false, // false for sign-out
                Quantity_Changed: quantity,
                Timestamp: currentTimestamp,
                Condition: 0, // 0 = Good, 1 = Needs_Repair, 2 = Broken
                Admin_ID: adminId || 1, // Uses the logged-in admin's ID
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

            // Update equipment quantity
            const updatedEquipment = {
                ...selectedEquipment,
                Item_Cnt: selectedEquipment.Item_Cnt - quantity
            };

            const equipmentResponse = await fetch(`${API_URL}/update/${selectedEquipment.ID}`, {
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
        } catch (error) {
            setStatus(`Error: ${error.message}`);
        }
    };

    if (!isOpen || !selectedEquipment) return null;

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
                            {/* Check Out Icon */}
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Check Out Equipment</h2>
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
                        {/* Display Selected Equipment */}
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm font-medium text-gray-700">Equipment:</p>
                            <p className="text-lg font-semibold text-gray-900">{selectedEquipment.Name}</p>
                            <p className="text-sm text-gray-600">Available: {selectedEquipment.Item_Cnt}</p>
                        </div>

                        {/* User Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name <span className="text-red-500">*</span></label>
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

                        {/* Quantity Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                min="1"
                                max={selectedEquipment.Item_Cnt}
                                className={`w-full px-3 py-2 bg-white border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
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
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                placeholder="Optional additional notes"
                                rows="3"
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
                                className="flex-1 py-2.5 px-4 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 disabled:bg-gray-300 transition-colors"
                                disabled={!userName.trim() || status === 'Processing...'}
                            >
                                {status === 'Processing...' ? 'Processing...' : 'Check Out'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EquipmentCheckOutModal;