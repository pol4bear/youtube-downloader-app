import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {IntlProvider} from 'react-intl';
import {Home, Search, Watch, NotFound} from '../pages';
import {Header, Footer} from '../components';
import Messages from '../locale/Messages';
import Config from './Config';
import {RootState} from '../stores';
import "./App.scss";


const App:React.FC = () => {
    const theme = useSelector((state:RootState) => state.theme.theme);

    return (
        <Router>
            <IntlProvider locale={Config.current_locale} messages={Messages[Config.current_locale]}>
            <div id="wrapper" className={theme}>
                <Header />
                <Switch>
                    <Route exact path={Config.base_url} component={Home} />
                    <Route path={`${Config.base_url}/search/:keyword`} component={Search} />
                    <Route path={`${Config.base_url}/watch`} component={Watch} />
                    <Route path={`${Config.base_url}/watch/:id`} component={Watch} />
                    <Route component={NotFound} />
                </Switch>
                <Footer />
            </div>
            </IntlProvider>
        </Router>
    );
}

export default App;