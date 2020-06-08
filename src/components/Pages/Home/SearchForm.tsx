import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { useIntl } from 'react-intl';

const SearchForm: React.FC = () => {
  const regexYoutubeUrl = /^(?:https?:\/\/)?(?:www\.)?youtu(\.be|be\.(?:com|co\.[a-zA-Z]{2}))\/watch\/?\?(?:.+(?:=.+)?&)*v=(?<id>\w+)(?:&.+(?:=.+)?)*&?\/?$/;
  const intl = useIntl();
  const [q, setQ] = useState('');
  const history = useHistory();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQ(event.target.value);
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result: RegExpExecArray | null = regexYoutubeUrl.exec(q);

    if (result !== null) {
      const id: string = result.groups ? result.groups.id : '';
      history.push(`${history.location.pathname}/watch?v=${id}`);
    } else {
      history.push(`${history.location.pathname}/search/${q}`);
    }
  };

  const message = intl.formatMessage({ id: 'searchFormMessage' });
  const placeholder = intl.formatMessage({ id: 'searchFormPlaceholder' });

  return (
    <>
      <h2>
        <FontAwesomeIcon icon={faYoutube} />
        {message}
      </h2>
      <FormGroup className="field" onSubmit={handleSubmit}>
        <FormField
          type="input"
          name="q"
          placeholder={placeholder}
          required
          autoComplete="off"
          value={q}
          onChange={handleChange}
        />
        <FormLabel htmlFor="q">{placeholder}</FormLabel>
        <FormButton htmlType="submit" block icon={<SearchOutlined />} />
      </FormGroup>
    </>
  );
};

const FormGroup = styled.form`
  margin-top: 10px;
  max-width: 1500px;
  padding: 15px 0 0;
  position: relative;
  width: 95%;
`;

const FormLabel = styled.label`
  color: #9b9b9b;
  display: block;
  font-size: 1rem;
  position: absolute;
  top: 0;
  transition: 0.2s;
`;

const FormField = styled.input`
  background: transparent;
  border: 0;
  border-bottom: 2px solid #9b9b9b;
  color: ${(props) => props.theme.fontColor};
  font-family: inherit;
  font-size: 1.3rem;
  outline: 0;
  padding: 7px 0;
  transition: border-color 0.2s;
  width: 100%;

  &::placeholder {
    color: transparent;
  }

  &:placeholder-shown ~ label {
    cursor: text;
    font-size: 1.3rem;
    top: 20px;
  }

  &:focus {
    ~ label {
      color: #11998e;
      display: block;
      font-size: 1rem;
      font-weight: 700;
      position: absolute;
      top: 0;
      transition: 0.2s;
    }
    border-image: linear-gradient(to right, #11998e, #38ef7d);
    border-image-slice: 1;
    border-width: 3px;
    font-weight: 700;
    padding-bottom: 6px;
  }

  &:required,
  &:invalid {
    box-shadow: none;
  }
`;

const FormButton = styled(Button)`
  background-color: ${(props) => props.theme.fontColor};
  color: ${(props) => props.theme.background};
  height: 40px;
  margin-top: 15px;

  &:hover {
    background-color: ${(props) => props.theme.fontColor};
    border: none;
    color: #1abc9c;
  }
`;

export default SearchForm;
