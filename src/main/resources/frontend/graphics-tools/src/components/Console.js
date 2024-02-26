import React, { useEffect, useState } from 'react';
import "./Console.css"

const Console = (props) => {
    const [consoleMessages, setConsoleMessages] = useState([]);

    useEffect(() => {
        setConsoleMessages(props.consoleMessages || []);
    }, [props.consoleMessages]);

    const handleClearConsole = () => {
        setConsoleMessages([]);
    };

    return (
        <div className='consoleContainer'>
            <div className='consoleBar'>
                <h2>Console</h2>
                <button onClick={handleClearConsole}>Clear</button>
            </div>

            <div className='console'>
                {consoleMessages.map((message, index) => (
                    <div key={index}>{message}</div>
                ))}
            </div>
        </div>
    );
};

export default Console;
