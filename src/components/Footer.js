import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faCopyright } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import './Footer.scss';

class Footer extends Component {
    render() {
        return (
            <footer className="container-fluid p-5 text-center">
                <p><FontAwesomeIcon icon={ faCopyright } fixedWidth />2020 Pol4bear | <a className="text-decoration-none" href="https://github.com/pol4bear/youtube-downloader-app"><FontAwesomeIcon icon={ faGithub } />GitHub</a></p>
            </footer>
        );
    }
}

export default Footer;