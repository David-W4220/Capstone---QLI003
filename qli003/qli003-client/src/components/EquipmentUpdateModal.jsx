import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

// Set the app element for accessibility
Modal.setAppElement('#root');

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
                fetchEquipment();
                setModalIsOpen(false);
            } else {
                setStatus('Error updating equipment');
            }
        } catch (error) {
            setStatus(`Error: ${error.message}`);
        }
    };

    const modalStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            padding: '20px',
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)'
        }
    };

    return (
        <div>
            <button 
                onClick={() => setModalIsOpen(true)}
                className="btn btn-primary"
            >
                Update Equipment
            </button>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                style={modalStyles}
                contentLabel="Update Equipment Modal"
            >
                <h2>Update Equipment</h2>
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label>Select Equipment:</label>
                        <select
                            className="form-control"
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

                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            disabled={!selectedId}
                        />
                        {errors.description && (
                            <div className="invalid-feedback">
                                {errors.description}
                            </div>
                        )}
                    </div>

                    {status && (
                        <div className={`alert ${status.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
                            {status}
                        </div>
                    )}

                    <div className="button-group">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!selectedId || !newDescription.trim()}
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setModalIsOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default EquipmentUpdateModal;