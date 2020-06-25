import React, {useContext, useEffect, useState} from 'react';
import history from '../../utils/history';
import { Helmet } from 'react-helmet';
import {CenterAligner} from "../Layout";
import {Button, Form, Input, notification, Row} from "antd";
import {useIntl} from "react-intl";
import styled from "styled-components";
import { Store } from 'antd/lib/form/interface';
import Countdown from "antd/es/statistic/Countdown";
import {ServerResponse} from "../../types";
import requestData from "../../utils/requestData";
import config from "../../common/config";
import crypto from 'crypto';
import LoginContext from "../../contexts/LoginContext";

const FindPassword: React.FC = () => {
  const intl = useIntl();
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<boolean>(true);
  const [emailValidation, setEmailValidation] = useState<boolean>(false);
  const [blockVerification, setBlockVerification] = useState<boolean>(false);
  const [auth, setAuth] = useState<string>('');
  const [timeout, setTimeout] = useState<number>(0);
  const [username, setUsername] = useState<string>('');
  const [pw, setPw] = useState<string>('');
  const [form] = Form.useForm();
  const { state } = useContext(LoginContext);


  const onFinish = (values: Store) => {
    if (!emailValidation) {
      if (timeout == 0)
        sendVerification();
      else
        emailVerification();
      return;
    }

    crypto.randomBytes(128, (err, buf) => {
      const salt = buf.toString('base64');
      crypto.pbkdf2(values.password, salt, 10000, 256, 'sha512', (erro, key) => {
        const password = key.toString('base64');
        requestData<ServerResponse>(`changePassword${config.serverSuffix}`, {
          password,
          salt
        }, false).then((response) => {
          if (response.data.success) {
            notification['success']({
              message: `${intl.messages.changePasswordSuccessTitle}`,
              description: `${intl.messages.changePasswordSuccessContent}`,
              onClose: () => {
                history.push('login');
              }
            });
          }
          else {
            notification['error']({
              message: `${intl.messages.changePasswordFailTitle}`,
              description: `${intl.messages.changePasswordFailContent}`,
              onClose: () => {
                window.location.reload();
              }
            });
          }
        });
      })
    });
  };

  const sendVerification = () => {
    setBlockVerification(true);
    requestData<ServerResponse>(`sendVerification${config.serverSuffix}`, { email }, false).then((response) => {
      setTimeout(Date.now() + 1000 * 60 * 5);
      setBlockVerification(false);
    });
  }

  const emailVerification = () => {
    requestData<ServerResponse>(`emailVerification${config.serverSuffix}`, { auth }, false).then((response) => {
      if (response.data.success) {
        setEmailValidation(true);
        setTimeout(0);
      }
      else {
        // @ts-ignore
        form.setFields([
          {
            name: ['auth'],
            errors: [`${intl.messages.verificationFail}`]
          }
        ]);
      }
    }).catch(() => {
      setTimeout(0);
    });
  }

  // @ts-ignore
  const handleChange = (changedFields: FieldData[], allFields: FieldData[]) => {
    if (changedFields.length == 0) return;

    const field = changedFields[0];
    switch (field.name[0]) {
      case 'email':
        const error = field.errors.length != 0;
        setEmailError(error);
        if (!error) {
          requestData<ServerResponse>(`validateEmail${config.serverSuffix}`, { email }, false).then((response) => {
            if (!response.data.success) {
              setEmailError(false);
            }
            else {
              // @ts-ignore
              form.setFields([
                {
                  name: ['email'],
                  value: field.value,
                  errors: [`${intl.messages.emailNotFound}`]
                }
              ]);
              setEmailError(true);
            }
          });
        }

        setEmail(field.value);
        break;
      case 'auth':
        setAuth(field.value);
        break;
      case 'useranme':
        setUsername(field.value)
        break;
      case 'pw':
        setPw(field.value);
        break;
    }
  }

  const onTimeout = () => {
    setTimeout(0);
    form.setFieldsValue({
      auth: ''
    });
  }

  useEffect(() => {
    if (!state.loading && state.isLoggedIn) {
      const pathname = history.location.pathname;
      const slash = pathname[pathname.length-1] === '/' ? '' : '/';
      history.push(`${history.location.pathname}${slash}..`);
      history.go(0);
    }
  }, [state]);

  return (
    <CenterAligner>
      <Helmet>
        <title>{intl.messages.findPassword}</title>
      </Helmet>
      <Wrapper>
        <h1>{intl.messages.findPassword}</h1>
        <Form
          {...layout}
          name="register"
          form={form}
          size="large"
          onFinish={onFinish}
          onFieldsChange={handleChange}
        >
          <Form.Item
            label={`${intl.messages.email}`}
            name="email"
            rules={[{ required: true, message: `${intl.messages.emailRequired}` }, { type: 'email', message: `${intl.messages.emailType}` }]}
          >
            <Input placeholder={`${intl.messages.emailPlaceholder}`} disabled={emailValidation || timeout!=0} value={email} />
          </Form.Item>
          {!emailValidation && !emailError && timeout == 0 && (
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" disabled={blockVerification || timeout!=0} style={{width: "150px"}}>{ intl.messages.sendAuth }</Button>
            </Form.Item>)}
          { timeout != 0 && (<><Form.Item
            label={`${intl.messages.auth}`}
            name="auth"
            rules={[{required: true, message: `${intl.messages.authRequired}`}]}
          >
            <Input placeholder={`${intl.messages.authPlaceholder}`} value={auth} />
          </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" style={{width: "150px"}}>{intl.messages.authorize}</Button>
              <Button type="link" onClick={onTimeout}>{intl.messages.cancel}</Button>
              <Countdown format="mm:ss" value={timeout} style={{display: "inline-block", marginLeft: "15px"}} onFinish={onTimeout} />
            </Form.Item></>)}
          { emailValidation && (
            <>
            <Form.Item
              label={`${intl.messages.pw}`}
              name="password"
              rules={[{ required: true, message: `${intl.messages.pwRequired}` }]}
            >
              <Input.Password placeholder={`${intl.messages.pwPlaceholder}`} value={pw} />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" disabled={!emailValidation} htmlType="submit">
                {intl.messages.apply}
              </Button>
            </Form.Item></>)}
        </Form>
      </Wrapper>
    </CenterAligner>

  );
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { xs: { offset: 0, span: 24 }, sm: { offset: 4, span: 20 }, md: { offset: 4, span: 20 }, lg: { offset: 4, span: 20 } },
};

const Wrapper = styled.div`
    width: 100%;
    max-width: 750px;
    label { color: ${(props) => props.theme.fontColor}!important };
`;

export default FindPassword;
