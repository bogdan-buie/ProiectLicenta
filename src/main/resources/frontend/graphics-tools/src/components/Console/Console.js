import React, { useEffect, useState } from 'react';
import "./Console.css"
import broomIcon from '../../../src/assets/image/broom.png';

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
                <button onClick={handleClearConsole} title="Clear console">
                    <img src={broomIcon} className='icon' />
                </button>
            </div>

            <div className='console'>
                {consoleMessages.map((messageObject, index) => (
                    // daca mesajul este de tip eroare textul va avea alta culaore
                    <div key={index} className={messageObject.type === 'ERROR' ? 'consoleError' : ''}>
                        {messageObject.message}
                    </div>
                ))}
            </div>


        </div>
    );
};

export default Console;
