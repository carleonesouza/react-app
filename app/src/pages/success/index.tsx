import React from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import './style.css'
import MyHearder from '../header';

const SuccessfullyCreated = () => {

    return (
        <div id="success" >
               <MyHearder/>
            <div className="mensage" style={{ color: '#34CB79' }}>
                <AiFillCheckCircle size={52} /><br/><br/>
                <p>Successfully Created!</p>
            </div>            
        </div>

    );
}

export default SuccessfullyCreated;