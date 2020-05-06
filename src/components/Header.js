import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import Config from '../common/Config';

class Header extends Component {
  render() {
    let lang = this.props.match.params.lang == undefined ? Config.current_locale : this.props.match.params.lang;

    return (
      <header className="sticky-top">
          <Navbar changeTheme={this.props.changeTheme} />
      </header>
    )
  }
}

export default withRouter(Header);