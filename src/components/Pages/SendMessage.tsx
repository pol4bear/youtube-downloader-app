import React, {useContext, useEffect, useState} from 'react';
import {Button, Form, Input, notification} from "antd";
import requestData from "../../utils/requestData";
import {ServerResponse} from "../../types";
import config from "../../common/config";
import {useIntl} from "react-intl";
import history from "../../utils/history";
import LoginContext from "../../contexts/LoginContext";
import styled from "styled-components";
import {Helmet} from "react-helmet";
import {CenterAligner} from "../Layout";

const SendMessage: React.FC = () => {
  const intl = useIntl();
  const [sending, setSending] = useState<boolean>(false);
  const {state} = useContext(LoginContext);

  useEffect(() => {
    if (!state.loading && !state.isLoggedIn) {
      const pathname = history.location.pathname;
      const slash = pathname[pathname.length-1] === '/' ? '' : '/';
      history.push(`${history.location.pathname}${slash}login`);
    }
  }, [state]);

  const layout = {
    labelCol: {
      span: 3,
    },
    wrapperCol: {
      span: 21,
    },
  };

  const validateMessages = {
    required: `\${label}${intl.messages.messageRequired}`,
    types: {
      email: `\${label}${intl.messages.messageEmailValidate}`,
    },
  };

  const onFinish = (values: any) => {
    setSending(true);
    requestData<ServerResponse>(`sendMessage${config.serverSuffix}`, values, false).then(() => {
      notification['success']({
        message: `${intl.messages.messageSuccessTitle}`,
        description: `${intl.messages.messageSuccessContent}`,
        onClose: () => {
          setSending(false);
          window.location.reload();
        }
      });
    }).catch(() => {
      notification['error']({
        message: `${intl.messages.messageFailTitle}`,
        description: `${intl.messages.messageFailContent}`,
        onClose: () => {
          setSending(false);
          return;
        }
      });
    });
  };
  return (
    <CenterAligner>
      <Helmet>
        <title>{intl.messages.messageSend}</title>
      </Helmet>
    <Wrapper>
      <h1>{intl.messages.messageSend}</h1>
    <Form {...layout} name="message-form" onFinish={onFinish} validateMessages={validateMessages}>
      <Form.Item
        name="receiver"
        label={intl.messages.messageReceiver as string}
        rules={[
          {
            required: true,
          },
          {
            type: 'email',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="title"
        label={intl.messages.messageTitle as string}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="content" label={intl.messages.messageContent as string} rules={[
        {required: true},
      ]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 3 }}>
        <Button type="primary" htmlType="submit" disabled={sending}>
          {intl.messages.messageSend}
        </Button>
        <Button disabled={sending} style={{marginLeft: '2px'}} onClick={() => { history.push(`${history.location.pathname}/../received-messages`); history.go(0); }}>
          {intl.messages.messageReceived}
        </Button>
        <Button disabled={sending} style={{marginLeft: '2px'}} onClick={() => { history.push(`${history.location.pathname}/../sent-messages`); history.go(0); }}>
          {intl.messages.messageSent}
        </Button>
      </Form.Item>
    </Form>
    </Wrapper>
    </CenterAligner>
  );
};

const Wrapper = styled.div`
    width: 100%;
    max-width: 575px;
    label { color: ${(props) => props.theme.fontColor}!important };
`;

export default SendMessage;
