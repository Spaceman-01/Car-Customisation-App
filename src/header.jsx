import React, { useEffect } from "react";
import "../public/styles.css"

function Header(props) {

    function handleClick(e) {
        let colour = e.target.getAttribute('name');
        props.selectedColour(colour);
    }

    return (
        <div className="header-container">
            <p>Select Body Colour</p>
            <div onClick={handleClick} name="#505050" className="colour black"></div>
            <div onClick={handleClick} name="#ededed" className="colour white"></div>
            <div onClick={handleClick} name="#002e73" className="colour blue"></div>
            <div onClick={handleClick} name="#db0404" className="colour red"></div>
        </div>
    );
}

export default Header;