// import React from 'react';
// import './Button.css';
// import { Link } from 'react-router-dom';

// export function Button() {
//   return (
//     <Link to='sign-up'>
//       <button className='btn'>Sign Up</button>
//     </Link>
//   );
// }

import React, { useEffect } from "react";
import "./Button.css";
import { Link } from "react-router-dom";
import { useState } from "react";

const STYLES = ["btn--primary", "btn--outline", "btn--test"];
const SIZES = ["btn--medium", "btn--large"];

export const Button = ({
    children,
    type,
    onClick,
    buttonStyle,
    buttonSize,
    link,
}) => {
    const checkButtonStyle = STYLES.includes(buttonStyle)
        ? buttonStyle
        : STYLES[0];
    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];
    const [activateToken, setActivateToken] = useState("");

    useEffect(() => {
        const Token = localStorage.getItem("accessToken");
        setActivateToken(Token);
    }, []);

    const onClickLogout = () => {
        console.log(activateToken);
        alert("로그아웃이 되었습니다~");
        window.localStorage.removeItem("accessToken");
    };

    return (
        // <Link to='/sign-up' className='btn-mobile'>
        <button
            className={`btn ${checkButtonStyle} ${checkButtonSize}`}
            onClick={onClick}
            type={type}
        >
            <Link
                to={link}
                className="btn-mobile"
            >
                {children}
            </Link>
        </button>
        // {/*</Link>*/}
    );
};
