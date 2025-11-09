import React from 'react';

const EquipmentDetailsModal = ({ equipment, isOpen, onClose }) => {
    if (!equipment || !isOpen) return null;

    return (
        <>
            {/* Modal Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Modal Header */}
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                        <h2 className="text-2xl font-bold text-gray-800">{equipment.Name}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                        >
                            ×
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6">
                        {/* Equipment details */}
                        <div className="grid grid-cols-1 gap-4">
                            {/* ID and Location */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500">Equipment ID</h3>
                                    <p className="text-lg font-semibold text-gray-900">{equipment.ID}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                                    <p className="text-lg font-semibold text-gray-900">{equipment.Alpha_Loc}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                <p className="text-gray-900 whitespace-pre-wrap">
                                    {equipment.Description || 'No description available'}
                                </p>
                            </div>

                            {/* Inventory Status */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500">Current Stock</h3>
                                    <p className={`text-lg font-semibold ${
                                        equipment.Item_Cnt <= equipment.Threshold ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                        {equipment.Item_Cnt}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500">Threshold</h3>
                                    <p className="text-lg font-semibold text-gray-900">{equipment.Threshold}</p>
                                </div>
                            </div>

                            {/* Reorder Information */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500">Reorder Link/Primary Qty</h3>
                                    <p className="text-gray-900">
                                        {equipment.ReodrLk_Pri_Qty || 'Not specified'}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500">Buy Quantity</h3>
                                    <p className="text-gray-900">
                                        {equipment.BuyQty || 'Not specified'}
                                    </p>
                                </div>
                            </div>

                            {/* Status Indicator */}
                            {equipment.Item_Cnt <= equipment.Threshold && (
                                <div className="bg-red-50 border border-red-200 p-4 rounded-lg mt-4">
                                    <div className="flex items-center">
                                        <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-red-700 font-medium">
                                            Stock Alert: Inventory below threshold
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EquipmentDetailsModal;
