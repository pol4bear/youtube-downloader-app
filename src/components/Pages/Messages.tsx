import React, {useContext, useEffect, useState} from 'react';
import history from '../../utils/history';
import {Button, Form, Input, Modal, notification, Pagination, Table} from "antd";
import {CenterAligner, LoadWrapper, Main} from "../Layout";
import LoginContext from "../../contexts/LoginContext";
import {useRouteMatch} from "react-router";
import {Helmet} from "react-helmet";
import {useIntl} from "react-intl";
import requestData from "../../utils/requestData";
import {MessageResult, ServerResponse, Message as MessageItem} from "../../types";
import config from "../../common/config";
import styled from "styled-components";

interface MessageProps {
  mode: 'Received' | 'Sent';
}


interface MatchParams {
  lang?: string
  page?: string
}

interface TableData extends MessageItem {
  key: string;
  formattedTime: string;
}

const Messages: React.FC<MessageProps> = ({mode}) => {
  const match = useRouteMatch<MatchParams>();
  const intl = useIntl();
  const page = match.params.page ? Number(match.params.page) : 1;
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState<TableData>({key: "", formattedTime: "", no: 0, title: '', content: '', time: new Date()});
  const [deleting, setDeleting] = useState<boolean>(false);
  const { state } = useContext(LoginContext);

  let pathname = history.location.pathname;
  let login = './login';
  if (match.params.page) {
    pathname = pathname.slice(0, history.location.pathname.lastIndexOf('/'))
    login = '../login';
  }

  let title, columnTitle, column, messageButtonContent, otherMessages: string;
  if (mode == 'Received') {
    title = intl.messages.messageReceived;
    columnTitle = intl.messages.sender;
    column = 'sender'
    messageButtonContent = intl.messages.messageSent;
    otherMessages = "sent-messages";
  }
  else {
    title = intl.messages.messageSent;
    columnTitle = intl.messages.receiver;
    column = 'receiver';
    messageButtonContent = intl.messages.messageReceived;
    otherMessages = 'received-messages';
  }

  useEffect(() => {
    requestData<ServerResponse>(`getMessages${config.serverSuffix}`, {page: `${page}`, mode}, false).then(response => {
      const result = response.data.result as MessageResult;
      setTotal(result.count);
      setMessages(result.messages);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const messageTableItems: TableData[] = [];
    for (let i = 0; i< messages!.length; i++) {
      const message = messages![i];
      const time = new Date(`${message.time} UTC`);
      // @ts-ignore
      messageTableItems.push({...message, key: (i + 1).toString(), formattedTime: time.toLocaleString()} );
    }
    setTableData(messageTableItems);
  }, [messages]);

  useEffect(() => {
    if (!state.loading && !state.isLoggedIn) {
      history.push(login);
    }
  }, [state]);

  if (loading) {
    return (
      <Main>
        <Helmet>
          <title>{intl.messages.loading as string}</title>
        </Helmet>
        <LoadWrapper />
      </Main>
    );
  }

  const handleDelete = () => {
    setDeleting(true);
    requestData<ServerResponse>(`deleteMessage${config.serverSuffix}`, {no: `${currentMessage!.no}`}, false).then(() => {
      notification['success']({
        message: `${intl.messages.messageDeleteSuccessTitle}`,
        description: `${intl.messages.messageDeleteSuccessContent}`,
        onClose: () => {
          setDeleting(false);
          handleClose();
          window.location.reload();
        }
      });
    }).catch(() => {
      notification['error']({
        message: `${intl.messages.messageDeleteFailTitle}`,
        description: `${intl.messages.messageDeleteFailContent}`,
        onClose: () => {
          setDeleting(false);
          return;
        }
      });
    });
  }

  const handleClose = () => {
    if (!deleting)
      setVisible(false);
  }

  const handleChange = (page: number) => {
    history.push(`${pathname}/${page}`);
    history.go(0);
  }

  const columns = [
    {
      title: intl.messages.messageTitle,
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: columnTitle,
      dataIndex: column,
      key: column,
    },
    {
      title: intl.messages.messageTime,
      dataIndex: 'formattedTime',
      key: 'time',
    },
  ];


return (
      <CenterAligner>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Wrapper>
          <h1>{title}</h1>
          <Button style={{marginRight: '2px'}} onClick={() => { history.push(`${pathname}/../${otherMessages}`); history.go(0); }}>
            {messageButtonContent}
          </Button>
          <Button onClick={() => {history.push(`${pathname}/../send-message`); history.go(0);}}>{intl.messages.messageSend}</Button>
            <Table
              onRow={(record, rowIndex) => {
                return {
                  onClick: event => {
                    setCurrentMessage(record);
                    setVisible(true);
                  },
                }
              }}
              pagination={false}
              columns={columns}
              dataSource={tableData}
              style={{width: "100%"}}
            />
        </Wrapper>
            <Pagination defaultCurrent={page} total={total} onChange={handleChange} showSizeChanger={false} />
            <Modal
              visible={visible}
              centered
              title={currentMessage!.title}
              onCancel={handleClose}
              footer={[
                <Button key="delete" onClick={handleDelete}>
                  {intl.messages.delete}
                </Button>,
                <Button type="primary" key="close" onClick={handleClose}>
                  {intl.messages.close}
                </Button>
              ]}
              >
              {mode == 'Received' ? `${intl.messages.messageSender}: ${currentMessage!.sender}` : `${intl.messages.messageReceiver}: ${currentMessage!.receiver}`}<br />
              {`${intl.messages.messageTime}: ${currentMessage!.formattedTime}`}<br />
              {`${intl.messages.messageContent}: ${currentMessage!.content}`}
            </Modal>
      </CenterAligner>
  );
}

const Wrapper = styled.div`
    width: 100%;
    max-width: 575px;
    label { color: ${(props) => props.theme.fontColor}!important };
`;

export default Messages;