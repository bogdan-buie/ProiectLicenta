import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { getUserId, getRole } from '../../utils/axios_helper';
import { clearLocalStorage } from '../../utils/axios_helper';

import userImage from '../../assets/image/user.png';

function Header() {
    let navigate = useNavigate();
    const userId = getUserId(); // Obținem ID-ul de utilizator
    const role = getRole();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Starea care urmărește dacă meniul este deschis sau nu

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // Inversăm starea meniului la fiecare apăsare
    };
    const handleLogout = () => {
        clearLocalStorage();
        navigate('/home');
        // Aici poți adăuga logica pentru deconectarea utilizatorului sau alte acțiuni asociate cu logout-ul
        console.log('Utilizatorul a fost deconectat');
        // De asemenea, poți adăuga o redirecționare către pagina de login sau alte pagini după logout
    };
    return (
        <div className='header'>
            <div className='leftSection'>
                <button>
                    <Link to={`/home`}>
                        Home
                    </Link>
                </button>
                <button>
                    <Link to={`/explore`}>
                        Explore projects
                    </Link>
                </button>
            </div>
            <div className='rightSection'>
                {role === "admin" &&
                    <button>
                        <Link to={`/admin`}>
                            ADMIN OPTIONS
                        </Link>
                    </button>}
                {userId ? (
                    <div className="dropdown">
                        <img src={userImage} className="userImage" onClick={toggleMenu} />
                        {isMenuOpen && ( // Verificăm dacă meniul este deschis și afișăm conținutul meniului dacă da
                            <div className="dropdownContent">
                                <Link to="/user/profile/edit">Edit profile</Link>
                                <Link to="/mypage">User page</Link>
                                <span onClick={handleLogout}>Logout</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <button>
                        <Link to={`/login`}>
                            LOGIN
                        </Link>
                    </button>
                )}
            </div>
        </div>
    );
}

export default Header;
