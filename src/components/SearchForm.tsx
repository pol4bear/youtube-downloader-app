import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons'
import {faYoutube} from '@fortawesome/free-brands-svg-icons';
import {useIntl} from 'react-intl';
import Config from '../common/Config';
import './SearchForm.scss';

const SearchForm:React.FC = () => {
    const regex_youtube_url:RegExp = /^(?:https?:\/\/)?(?:www\.)?youtu(\.be|be\.(?:com|co\.[a-zA-Z]{2}))\/watch\/?\?(?:.+(?:=.+)?&)*v=(?<id>\w+)(?:&.+(?:=.+)?)*&?\/?$/;
    const intl = useIntl();
    const [q, setQ] = useState('');
    const history = useHistory();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQ(event.target.value);
   }
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const result:RegExpExecArray|null = regex_youtube_url.exec(q);

        

        if (result !== null) {
            const id = result.groups && result.groups.id;
            history.push(Config.base_url + "/watch?v=" + id);
       }
        else {
            history.push(Config.base_url + "/search/" + q);
       }
   }

    const message = intl.formatMessage({id: "searchform-message"});
    const placeholder = intl.formatMessage({id: "searchform-placeholder"});
    
    return (
        <div>
            <h4><FontAwesomeIcon icon={faYoutube} />{message}</h4>
            <form className="form__group field" onSubmit={handleSubmit}>
                <input type="input" id="search-box" className="form__field text-dark" name="q" placeholder={placeholder} required autoComplete="off" value={q} onChange={handleChange} />
                <label htmlFor="q" className="form__label">{placeholder}</label>
                <button type="submit" className="btn btn-block mt-2">
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </form>
        </div>
    );
}

export default SearchForm;