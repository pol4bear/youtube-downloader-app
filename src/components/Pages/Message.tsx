import React, {useContext, useEffect, useState} from 'react';
import history from '../../utils/history';
import {Button, Form, Input, Modal, notification, Pagination, Table, Tabs} from "antd";
import {CenterAligner, LoadWrapper, Main} from "../Layout";
import LoginContext from "../../contexts/LoginContext";
import {useRouteMatch} from "react-router";
import {Helmet} from "react-helmet";
import {useIntl} from "react-intl";
import requestData from "../../utils/requestData";
import {MessageResult, ServerResponse, Message as MessageItem} from "../../types";
import config from "../../common/config";

interface MatchParams {
  lang?: string
  page?: string
}

interface TableData extends MessageItem {
  key: string;
  formattedTime: string;
}

const { TabPane } = Tabs;

const Message: React.FC = () => {
  const match = useRouteMatch<MatchParams>();
  const intl = useIntl();
  const page = match.params.page ? Number(match.params.page) : 1;
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [receivedMessages, setReceivedMessages] = useState<MessageItem[]>([]);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState<MessageItem>({title: '', sender: '', content: '', time: new Date()});
  const { state } = useContext(LoginContext);

  useEffect(() => {
    requestData<ServerResponse>(`getMessages${config.serverSuffix}`, {page: `${page}`}, false).then(response => {
      const result = response.data.result as MessageResult;
      setTotal(result.count);
      setReceivedMessages(result.messages);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const messageTableItems: TableData[] = [];
    for (let i = 0; i< receivedMessages!.length; i++) {
      const message = receivedMessages![i];
      const time = new Date(`${message.time} UTC`);
      // @ts-ignore
      messageTableItems.push({...message, key: (i + 1).toString(), formattedTime: time.toLocaleString()} );
    }
    setTableData(messageTableItems);
  }, [receivedMessages]);

  useEffect(() => {
    if (!state.loading && !state.isLoggedIn) {
      const pathname = history.location.pathname;
      const slash = pathname[pathname.length-1] === '/' ? '' : '/';
      history.push(`${history.location.pathname}${slash}login`);
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

  const handleCancel = () => {
    setVisible(false);
  }

  const handleChange = (page: number) => {
    const pathname = history.location.pathname.slice(0, history.location.pathname.lastIndexOf('/'))
    history.push(`${pathname}/${page}`);
    history.go(0);
  }

  const receivedColumns = [
    {
      title: intl.messages.messageTitle,
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: intl.messages.messageSender,
      dataIndex: 'sender',
      key: 'sender',
    },
    {
      title: intl.messages.messageTime,
      dataIndex: 'formattedTime',
      key: 'time',
    },
  ];

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
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
          <title>{intl.messages.message as string}</title>
        </Helmet>
        <Tabs defaultActiveKey="1">
          <TabPane tab={intl.messages.messageReceived} key="1">
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
              columns={receivedColumns}
              dataSource={tableData}
            />
            <Pagination defaultCurrent={page} total={total} onChange={handleChange} showSizeChanger={false} />
            <Modal
              visible={visible}
              title={currentMessage!.title}
              onOk={handleCancel}
              onCancel={handleCancel}
              >
              {`${intl.messages.messageSender}: ${currentMessage!.sender}`}<br />
              {`${intl.messages.messageTime}: ${currentMessage!.time}`}<br />
              {`${intl.messages.messageContent}: ${currentMessage!.content}`}
            </Modal>
          </TabPane>
          <TabPane tab={intl.messages.messageSend} key="2">
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
              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit" disabled={sending}>
                  {intl.messages.messageSubmit}
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </CenterAligner>
  );
}

export default Message;