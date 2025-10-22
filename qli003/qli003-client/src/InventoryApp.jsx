import React, { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:5097'; // Change the API_Base_URL to your hosts IP. 
// IE: from localhost to 192.168.X.X or the like
    //const API_CONTROLLER = 'QLIDb'; We have 5 controllers now
const HUB_URL = `${API_BASE_URL}/qliHub`;
const TABLE_CONTROLLERS = 
{
  Equipment: 'Equipment', Admins: 'Admins',   
  Auditlog: 'Auditlog', Transactionlog: 'Transactionlog',
};
//const API_URL = `${API_BASE_URL}/api/${API_CONTROLLER}`; moved into component now

/**
 * EquipmentUpdateForm Component 
 * Handles selecting an item and updating its description via a PUT request.
 */
const EquipmentUpdateForm = ({ equipment, fetchEquipment, API_URL }) => {
    const [selectedId, setSelectedId] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [status, setStatus] = useState('');

    const selectedItem = selectedId ? equipment.find(item => item.ID === parseInt(selectedId)) : null;

    useEffect(() => {
        if (selectedItem) {
            setNewDescription(selectedItem.Description || '');
            setStatus('');
        } else {
            setNewDescription('');
        }
    }, [selectedItem]);

    const handleUpdate = async (e) => {
        e.preventDefault();
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
            // Use the globally defined API_URL for the PUT request
            const response = await fetch(`${API_URL}/update/${selectedItem.ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItem),
            });

            if (response.status === 204) {
                setStatus(`Successfully updated item ID ${selectedItem.ID}.`);
                setSelectedId('');
                setNewDescription('');
            } else {
                const errorText = await response.text();
                setStatus(`Update failed: HTTP ${response.status}. Details: ${errorText.substring(0, 100)}...`);
            }
        } catch (err) {
            setStatus(`A network error occurred: ${err.message}`);
        }
    };

    return (
        <div className="p-6 bg-white border border-blue-200 rounded-xl shadow-lg mt-6">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Update Equipment Description</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
                <div className="flex flex-col">
                    <label htmlFor="equipment-select" className="text-sm font-medium text-gray-700 mb-1">Select Equipment Name:</label>
                    <select
                        id="equipment-select"
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="">-- Choose an item --</option>
                        {equipment && equipment.map(item => (
                            <option key={item.ID} value={item.ID}>
                                {item.Name} (ID: {item.ID}) - Stock: {item.Item_Cnt} @ {item.Alpha_Loc}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="description-input" className="text-sm font-medium text-gray-700 mb-1">New Description:</label>
                    <input
                        id="description-input"
                        type="text"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter new description"
                        required
                        disabled={!selectedId}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
                    disabled={!selectedId || status.includes('Updating')}
                >
                    Update Description
                </button>
            </form>
            {status && <p className={`mt-3 text-sm font-medium ${status.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>{status}</p>}
        </div>
    );
};

/**
 * InventoryApp (Main Component)
 * Manages state, data fetching, and SignalR connection.
 */
const InventoryApp = () => {
    //state for which table's currently selected
    const [selectedTable, setSelectedTable] = useState('Equipment');
    //API URL now's Build dynamically based on selection
    const API_URL = `${API_BASE_URL}/api/${selectedTable}`;

    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEquipment = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const sortedData = data.sort((a, b) => a.ID - b.ID);
            setEquipment(sortedData);
        } catch (error) {
            setError(error);
            console.error("Could not fetch data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEquipment();

        let connection;

        const startSignalRConnection = async () => {
            const signalR = window.signalR;

            if (!signalR || !signalR.HubConnectionBuilder) {
                console.warn("SignalR library not found globally (window.signalR is undefined). Real-time updates disabled.");
                return;
            }

            // --- SignalR Connection Logic ---
            connection = new signalR.HubConnectionBuilder()
                .withUrl(HUB_URL)
                .withAutomaticReconnect()
                .build();

            // 2. Set up the listener BEFORE starting the connection
            connection.on("RefreshData", () => {
                console.log("Refresh signal received. Re-fetching data...");
                fetchEquipment();
            });

            // 3. Start the connection
            try {
                await connection.start();
                console.log("SignalR Connected successfully.");
            } catch (err) {
                console.error("SignalR Connection Start Error:", err);
            }
        };

        startSignalRConnection();

        // 4. Cleanup function: Stop the connection when the component unmounts
        return () => {
            if (connection) {
                connection.stop();
                console.log("SignalR Connection stopped.");
            }
        };

    }, [fetchEquipment]);


    if (error) return <div className="p-8 text-center text-red-600 bg-red-100 rounded-lg m-8">Error fetching data: {error.message}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">

            {/* Table selection is fine */}
            <select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)} className="p-2 border rounded-lg mb-4">
                {Object.keys(TABLE_CONTROLLERS).map((key) => (<option key={key} value={TABLE_CONTROLLERS[key]}>{key}</option>))}
            </select>

            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
                Real-Time Equipment Inventory
            </h1>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <EquipmentUpdateForm equipment={equipment} fetchEquipment={fetchEquipment} API_URL={API_URL}/>
                </div>

                <div className="lg:col-span-2">
                    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Equipment List</h2>
                        {loading ? (
                            <div className="text-center p-4 text-gray-500">Loading...</div>
                        ) : (
                            <div className="overflow-y-auto h-96 border border-gray-100 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                            {/* 2. UPDATED: Added new headers */}
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Count</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {equipment.map((item) => (
                                            <tr key={item.ID} className="hover:bg-blue-50">
                                                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.ID}</td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{item.Name}</td>
                                                <td className="px-3 py-2 text-sm text-gray-700 max-w-xs ">{item.Description}</td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 font-bold">{item.Item_Cnt}</td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{item.Alpha_Loc}</td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{item.Threshold}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryApp;
