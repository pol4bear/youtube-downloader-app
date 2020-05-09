import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import styled from 'styled-components';
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
            <FormGroup className="field" onSubmit={handleSubmit}>
                <FormField type="input" name="q" placeholder={placeholder} required autoComplete="off" value={q} onChange={handleChange} />
                <FormLabel htmlFor="q">{placeholder}</FormLabel>
                <Button className="mt-3" type="submit" block><FontAwesomeIcon icon={faSearch} /></Button>
            </FormGroup>
        </div>
    );
}

const FormGroup = styled.form`
    position: relative;
    padding: 15px 0 0;
    margin-top: 10px;
    width: 100%;
`;

const FormLabel = styled.label`
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 1rem;
    color: #9b9b9b;
`;

const FormField = styled.input`
    font-family: inherit;
    width: 100%;
    border: 0;
    border-bottom: 2px solid #9b9b9b;
    outline: 0;
    font-size: 1.3rem;
    padding: 7px 0;
    background: transparent;
    transition: border-color 0.2s;

    &::placeholder {
        color: transparent;
    }

    &:placeholder-shown ~ label {
        font-size: 1.3rem;
        cursor: text;
        top: 20px;
    }

    &:focus {
        ~ label {
            position: absolute;
            top: 0;
            display: block;
            transition: 0.2s;
            font-size: 1rem;
            color: #11998e;
            font-weight:700;    
        }
        padding-bottom: 6px;  
        font-weight: 700;
        border-width: 3px;
        border-image: linear-gradient(to right, #11998e, #38ef7d);
        border-image-slice: 1;
    }

    &:required,&:invalid {box-shadow:none;}
`;

export default SearchForm;