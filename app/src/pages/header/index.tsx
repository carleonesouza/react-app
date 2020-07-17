import React from 'react';
import logo from '../../assets/logo.svg';
import { Link} from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';


const MyHearder = () => {

    return(
        <div id="page-create-point">
            <header>
                 <img src={logo} alt="Ecoleta"/>
                 <Link to="/">
                     <FiArrowLeft/>
                     Voltar para home</Link>
            </header>

        </div>
    );
}

export default MyHearder;