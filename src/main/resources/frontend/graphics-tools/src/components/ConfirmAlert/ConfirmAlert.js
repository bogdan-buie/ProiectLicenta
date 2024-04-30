import React, { useState } from 'react';
import './ConfirmAlert.css';

function ConfirmAlert({ message, onConfirm, onCancel }) {
    const [isVisible, setIsVisible] = useState(true);

    const handleConfirm = () => {
        setIsVisible(false);
        onConfirm();
    };

    const handleCancel = () => {
        setIsVisible(false);
        onCancel();
    };

    return (
        <div className={`confirmAlert ${isVisible ? 'show' : 'hide'}`}>
            <div className="confirmContent">
                <p>{message}</p>
                <div className="buttons">
                    <button onClick={handleConfirm}>OK</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmAlert;
