import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthComponent.css';
import { request, requestLite, setUserId, setRole, setToken } from '../../../utils/axios_helper';

const AuthComponent = () => {
    let navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState(''); // Mesajul de feedback

    const handleToggleMode = () => {
        setIsLogin(prevMode => !prevMode);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setMessage(''); // Resetează mesajul de feedback

        if (isLogin) {
            requestLite(
                "POST",
                "/public/login",
                {
                    email: email,
                    password: password
                }).then(
                    (response) => {//if (response.data.message === "Successful login" && response.data.role === "user") {
                        if (response.data.message === "Successful login") {
                            setRole(response.data.role);
                            setUserId(response.data.user_id);
                            if (response.data.token) {
                                setToken(response.data.token);
                                //console.log(response.data.token);
                            }

                            navigate('/mypage');
                        } else {
                            console.log(response.data);
                            setMessage(response.data); // Setează mesajul de feedback pentru cazul în care parola nu este corectă
                        }
                    }).catch(
                        (error) => {
                            console.log(error);
                        }
                    );
        } else {
            request(
                "POST",
                "/public/register",
                {
                    email: email,
                    password: password,
                    name: firstName,
                    lastName: lastName,
                    role: "user"//doar utilizatorii obișnuiți își pot crea cont
                }).then(
                    (response) => {
                        if (response.data.message === "User added with success" && response.data.role === "user") {
                            setRole(response.data.role);
                            setUserId(response.data.user_id);
                            if (response.data.token) {
                                setToken(response.data.token);
                            }

                            navigate('/mypage');
                            console.log(response.data);
                        }
                    }).catch(
                        (error) => {
                            console.log(error);
                        }
                    );
        }
    };

    return (
        <div className='container'>
            <div className="auth-container">

                <h2>{isLogin ? 'Login' : 'Register'}</h2>

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="form-control">
                            <label htmlFor="firstName">First Name:</label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    {!isLogin && (
                        <div className="form-control">
                            <label htmlFor="lastName">Last Name:</label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="form-control">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {message && <p className="message">{message}</p>} {/* Afișează mesajul de feedback */}
                    <div className='btnSection'>
                        <button className="centered-button" type="submit">{isLogin ? 'Login' : 'Register'}</button>
                    </div>

                </form>
                <p onClick={handleToggleMode} className="toggle-mode">
                    {isLogin ? 'Don\'t have an account? Register here.' : 'Already have an account? Login here.'}
                </p>
            </div>
        </div>
    );
};

export default AuthComponent;
