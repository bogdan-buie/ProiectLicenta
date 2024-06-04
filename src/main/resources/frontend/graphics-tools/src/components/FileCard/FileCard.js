import React, { useState, useEffect } from 'react';
import './FileCard.css';
import { request } from '../../utils/axios_helper';
export default function FileCard(props) {
    const [item, setItem] = useState();
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        setItem(props.obj);
    }, [props.obj]);


    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleDeleteClick = () => {
        request(
            "DELETE",
            `/modelproject/delete/${item.id}`,
            {}
        ).then(
            (response) => {
                console.log(response.data);
                props.loadModelProject();
            }).catch(
                (error) => {
                    console.log(error);
                }
            );
    };

    return (
        <div
            className="fileCard"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {item && <div>{item.alias}</div>}
            {isHovered && (
                <button className="deleteButton" onClick={handleDeleteClick}>
                    Delete
                </button>
            )}
        </div>
    );
}
