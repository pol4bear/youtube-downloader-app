import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { faYoutube, faThemeisle } from '@fortawesome/free-brands-svg-icons';
import { injectIntl } from 'react-intl';
import Config from '../common/Config';
import './SearchForm.scss';

class SearchForm extends Component {
    regex_youtube_url = /^(?:https?:\/\/)?(?:www\.)?youtu(\.be|be\.(?:com|co\.[a-zA-Z]{2}))\/watch\/?\?(?:.+(?:=.+)?&)*v=(?<id>\w+)(?:&.+(?:=.+)?)*&?\/?$/;

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.intl = this.props.intl;
        this.state = {
            q: '',
            v: ''
        };
    }

    handleChange(e) {
        this.setState({
            q: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        let result = this.regex_youtube_url.exec(this.state.q);

        
        if (result == null) {
            this.props.history.push(Config.base_url + "/search/" + this.state.q);
        }
        else {
            this.props.history.push(Config.base_url + "/watch?v=" + result.groups.id);
        }
    }

    render() {
        const message = this.intl.formatMessage({id: "searchform-message"});
        const placeholder = this.intl.formatMessage({id: "searchform-placeholder"});
        
        return (
            <div>
                <h4><FontAwesomeIcon icon={ faYoutube } />{message}</h4>
                <form className="form__group field" onSubmit={this.handleSubmit}>
                    <input type="input" id="search-box" className="form__field text-dark" name="q" placeholder={placeholder} required autoComplete="off" value={this.state.q} onChange={this.handleChange} />
                    <label htmlFor="q" className="form__label">{placeholder}</label>
                    <button type="submit" className="btn btn-block mt-2">
                        <FontAwesomeIcon icon={ faSearch } />
                    </button>
                </form>
            </div>
        );
    }
}

export default withRouter(injectIntl(SearchForm));