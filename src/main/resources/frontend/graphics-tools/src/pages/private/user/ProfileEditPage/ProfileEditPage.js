// ProfileEditForm.js
import React, { useState, useEffect } from 'react';
import './ProfileEditPage.css';
import { useNavigate } from 'react-router-dom'
import { getUserId, request } from '../../../../utils/axios_helper';
import { toast } from 'react-toastify';
import { clearLocalStorage } from '../../../../utils/axios_helper';
import ConfirmAlert from '../../../../components/ConfirmAlert/ConfirmAlert';
const ProfileEditPage = () => {
    let navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showConfirm, setShowConfirm] = useState(false); // pentru Delete cont

    useEffect(() => {
        setUserId(getUserId());
    }, [userId]);
    useEffect(() => {
        if (userId) {
            loadUser();
        }
    }, [userId]);

    const notify = (message) => {
        // Calling toast method by passing string
        toast(message);
    };
    const loadUser = async () => {
        request(
            "GET",
            `/user/get/${userId}`,
            {}
        ).then(
            (response) => {
                setUser(response.data);
                setEmail(response.data.email);
                setFirstName(response.data.name);
                setLastName(response.data.lastName);
                console.log(response.data);

            }).catch(
                (error) => {
                    console.log(error);
                }
            );
    }

    const handleUpdateAccount = () => {
        user.email = email;
        user.name = firstName;
        user.lastName = lastName;

        request(
            "PUT",
            `/user/update/${userId}`,
            user
        ).then(
            (response) => {
                if (response.data === "User updated with success") {
                    notify("User updated with success");
                }
                console.log(response.data);

            }).catch(
                (error) => {
                    console.log(error);
                }
            );
    };

    const handlePasswordReset = () => {
        if (newPassword !== confirmNewPassword) {
            setMessage("Passwords do not match!");
        } else {
            let changePasswordObject = {
                userId: userId,
                oldPassword: password,
                newPassword: newPassword
            }
            request(
                "POST",
                `/user/changePassword`,
                changePasswordObject
            ).then(
                (response) => {
                    console.log(response.data);
                    notify(response.data);
                    setConfirmNewPassword("");
                    setNewPassword("");
                    setPassword("");

                }).catch(
                    (error) => {
                        console.log(error);
                    }
                );
        }
    };
    const handleDeleteButtonClick = () => {
        setShowConfirm(true);
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
    };

    const handleConfirmDelete = () => {
        request(
            "DELETE",
            `/user/delete/${userId}`,
            {}
        ).then(
            (response) => {
                console.log(response.data);
                clearLocalStorage();
                navigate('/home');
            }).catch(
                (error) => {
                    console.log(error);
                }
            );
    };

    return (
        <div className="profileEditFormContainer">
            <div className="section">
                <h2>Update account</h2>
                <p>Here you can edit your details: </p>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" />
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" />
                <button onClick={handleUpdateAccount}>Update</button>
            </div>
            <div className="section">
                <h2>Update password</h2>
                <p>Ensure your account is using a long, random password to stay secure.</p>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Old password" />
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" />
                <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="Confirm New Password" />
                {message &&
                    <p className="red-text">{message}</p>
                }
                <button onClick={handlePasswordReset}>Reset Password</button>
            </div>
            <div className="section">
                <h2>Delete Account</h2>
                <p>Are you sure you want to delete your account?</p>
                <button onClick={handleDeleteButtonClick}>Delete Account</button>
            </div>
            {showConfirm && (
                <ConfirmAlert
                    message="Are you sure you want to delete? Once your account is deleted, all of its projects and data will be permanently deleted."
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </div>
    );
};

export default ProfileEditPage;
