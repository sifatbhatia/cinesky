import NavBar from "../NavBar/NavBar";
import React  from 'react';
import {AiOutlineMail} from "react-icons/ai";
import {BiPhoneCall} from "react-icons/bi"
function Contact() {
    return (
        <>
        <NavBar/>
        <div className="container">
            <h1 className="is-size-1">
                Contact
            </h1>

        </div>
        <div className="Info call">

        <ul className="is-size-3">
            <a href="mailto:bsifat@gmail.com"> <AiOutlineMail/> ⠀Email</a>
            <a href="tel:4072057374"> <BiPhoneCall/>⠀⠀Call</a>  
            </ul>
        </div>
        </>
    )
}

export default Contact;