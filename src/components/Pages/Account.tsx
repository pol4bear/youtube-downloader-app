import React, {useContext, useEffect, useState} from 'react';
import { Helmet } from 'react-helmet';
import {CenterAligner, LoadWrapper} from "../Layout";
import {Button, Checkbox, Form, Input, notification} from "antd";
import {useIntl} from "react-intl";
import LoginContext from "../../contexts/LoginContext";
import styled from "styled-components";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import { Store } from 'antd/lib/form/interface';
import {ValidateErrorEntity} from "rc-field-form/lib/interface";
import history from "../../utils/history";
import {Dictionary, FailResult, Salt, ServerResponse, User} from "../../types";
import requestData from "../../utils/requestData";
import config from "../../common/config";
import crypto from "crypto";

const Account: React.FC = () => {
  const intl = useIntl();
  const {state, logout} = useContext(LoginContext);
  const [username, setUsername] = useState<string>('');
  const [newPw, setNewPw] = useState<string>('');
  const [pw, setPw] = useState<string>('');
  const [form] = Form.useForm();

  const onFinish = (values: Store) => {
    if (values.username == state.userInfo.username && (!values.newPw || values.newPw == '')) {
      notification['error']({
        message: `${intl.messages.changeFailTitle}`,
        description: `${intl.messages.nothingChanged}`,
      });
      return;
    }
    requestData<ServerResponse>(`getSalt${config.serverSuffix}`, {email: state.userInfo.email}, false).then(response => {
      const result = response.data.result as Salt;
      crypto.pbkdf2(values.pw, result.salt, 10000, 256, 'sha512', (err, key) => {
        const params: Dictionary<string> = {
          password: key.toString('base64'),
        }
        if (username != '' && values.username != state.userInfo.username) params['username'] = values.username;
        if (newPw != '') {
          crypto.randomBytes(128, (err, buf) => {
            const salt = buf.toString('base64');
            crypto.pbkdf2(values.newPw, salt, 10000, 256, 'sha512', (erro, newKey) => {
              params['salt'] = salt;
              params['newPassword'] = newKey.toString('base64');

              requestData<ServerResponse>(`changeInfo${config.serverSuffix}`, params, false).then(() => {
                history.go(0);
              }).catch(() => {
                notification['error']({
                  message: `${intl.messages.changeFailTitle}`,
                  description: `${intl.messages.changeFailContent}`,
                });
              });
            })
          });
        }
        else {
          requestData<ServerResponse>(`changeInfo${config.serverSuffix}`, params, false).then(() => {
            history.go(0);
          }).catch(() => {
            notification['error']({
              message: `${intl.messages.changeFailTitle}`,
              description: `${intl.messages.changeFailContent}`,
            });
          });
        }
      })
    }).catch(() => {
      notification['error']({
        message: `${intl.messages.changeFailTitle}`,
        description: `${intl.messages.changeFailContent}`,
      });
    });
  }

// @ts-ignore
const handleChange = (changedFields: FieldData[], allFields: FieldData[]) => {
  if (changedFields.length == 0) return;

  const field = changedFields[0];

    switch(field.name[0]) {
      case 'username':
        setUsername(field.value);
        break;
      case 'newPw':
        setNewPw(field.value);
      case 'pw':
        setPw(field.value);
        break;
    }
  }

  const unregister = () => {
    requestData(`unregister${config.serverSuffix}`, {}, false).then(() => {
      logout();
    });
  }

  useEffect(() => {
    if (!state.loading && !state.isLoggedIn) {
      history.push('./login');
    }
    else {
      if (state.userInfo.username != '' && username == '') {
        setUsername(state.userInfo.username);
        form.setFieldsValue({
          username: state.userInfo.username
        });
      }
    }
  }, [state]);

  return (
    <CenterAligner>
      <Helmet>
        <title>{intl.messages.account}</title>
      </Helmet>
      <Wrapper>
        <h1>{intl.messages.account}</h1>
        <Form
          {...layout}
          name="account"
          size="large"
          form={form}
          onFinish={onFinish}
          onFieldsChange={handleChange}
        >
          <Form.Item
            label={`${intl.messages.username}`}
            name="username"
            rules={[{ required: true, message: `${intl.messages.usernameRequired}` }]}

          >
            <Input placeholder={`${intl.messages.usernamePlaceholder}`} value={username} />
          </Form.Item>
          <Form.Item
            label={`${intl.messages.newPw}`}
            name="newPw"
          >
            <Input.Password placeholder={`${intl.messages.newPwPlaceholder}`} value={newPw} />
          </Form.Item>
          <Form.Item
            label={`${intl.messages.currentPw}`}
            name="pw"
            rules={[{ required: true, message: `${intl.messages.pwRequired}` }]}
          >
            <Input.Password placeholder={`${intl.messages.pwPlaceholder}`} value={pw} />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              {intl.messages.apply}
            </Button>
            <Button type="primary" style={{float: "right"}} onClick={unregister}>
              {intl.messages.unregister}
            </Button>
          </Form.Item>
        </Form>
      </Wrapper>
    </CenterAligner>

  );
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { xs: { offset: 0, span: 24 }, sm: { offset: 6, span: 18 }, md: { offset: 6, span: 18 }, lg: { offset: 6, span: 18 } },
};

const Wrapper = styled.div`
    width: 100%;
    max-width: 575px;
    label { color: ${(props) => props.theme.fontColor}!important };
`;

export default Account;
