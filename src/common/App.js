import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { Home, Search, Watch, NotFound } from '../pages';
import { Header, Footer } from '../components';
import Messages from '../locale/Messages';
import Config from './Config';
import "./App.scss";


class App extends Component {
    constructor(props) {
        super(props);
        this.changeTheme = this.changeTheme.bind(this);

        this.state = {
            theme: 'theme-light'
        };

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark').matches) {
            this.setState({
                theme: 'theme-dark'
            });
        }
    }

    changeTheme() {
        if (this.state.theme == 'theme-light') {
            this.setState({
                theme: 'theme-dark'
            });
        }
        else {
            this.setState({
                theme: 'theme-light'
            });
        }


    }

    render() {
        return (
            <Router>
                <IntlProvider locale={Config.current_locale} messages={Messages[Config.current_locale]}>
                <div id="wrapper" className={this.state.theme}>
                    <Switch>
                        <Route exact path={Config.base_url}><Header changeTheme={this.changeTheme} /><Home /><Footer /></Route>
                        <Route path={`${Config.base_url}/search/:keyword`}><Header changeTheme={this.changeTheme} /><Search /><Footer /></Route>
                        <Route path={`${Config.base_url}/watch`}><Header changeTheme={this.changeTheme} /><Watch /><Footer /></Route>
                        <Route><Header changeTheme={this.changeTheme} /><NotFound /><Footer /></Route>
                    </Switch>
                </div>
                </IntlProvider>
            </Router>
        );
    }
}

export default App;