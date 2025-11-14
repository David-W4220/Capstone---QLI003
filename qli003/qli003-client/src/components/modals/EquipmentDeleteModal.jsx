import React, { useState, useEffect } from 'react';

const EquipmentDeleteModal = ({ equipment, isOpen, onClose, onConfirm }) => {
    const [confirmName, setConfirmName] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setConfirmName('');
        }
    }, [isOpen]);

    if (!isOpen || !equipment) return null;

    const equipmentName = equipment?.Name || 'Unknown Equipment';
    const isNameMatch = confirmName === equipmentName;

    return (
        <>
            {/* Modal Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fadeIn"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-slideUp">
                    {/* Modal Header */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Delete Equipment</h2>
                                <p className="text-sm text-gray-600">This action cannot be undone</p>
                            </div>
                        </div>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 space-y-4">
                        <div>
                            <p className="text-sm text-gray-700 mb-3">
                                You are about to delete the following equipment:
                            </p>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                                <p className="text-lg font-bold text-gray-900">{equipmentName}</p>
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="flex gap-2">
                                <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <p className="text-xs text-red-700">
                                    This will permanently delete the equipment from the system. All related transaction history will remain for record-keeping purposes.
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type <span className="font-bold text-gray-900">{equipmentName}</span> to confirm deletion
                            </label>
                            <input
                                type="text"
                                value={confirmName}
                                onChange={(e) => setConfirmName(e.target.value)}
                                placeholder="Enter equipment name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                            {confirmName && !isNameMatch && (
                                <p className="mt-1 text-xs text-red-600">Equipment name does not match</p>
                            )}
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 px-4 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors btn-scale"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onConfirm(equipment);
                                onClose();
                            }}
                            disabled={!isNameMatch}
                            className="flex-1 py-2.5 px-4 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors btn-scale"
                        >
                            Delete Equipment
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EquipmentDeleteModal;
