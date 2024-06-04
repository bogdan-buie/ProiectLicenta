import React from 'react'
import './Unauthorized.css';
import { Link } from 'react-router-dom';
export default function Unauthorized() {
    return (
        <div className='unauthorizedPage'>
            <div className='card'>
                <h1>401 - Unauthorized</h1>
                <p>You are not authorized to access this page</p>
                <Link to={`/home`}>
                    <button>Back to home page</button>
                </Link>
            </div>


        </div>
    )
}
