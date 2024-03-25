import React from 'react';
import './Header.css';
function Header() {
    return (
        <div className='header'>
            <nav>
                <ul className='navLinks'>
                    <li><a href="/home">A</a></li>
                    <li><a href="/">B</a></li>
                    <li><a href="/">C</a></li>
                </ul>
            </nav>
        </div>

    )
}

export default Header