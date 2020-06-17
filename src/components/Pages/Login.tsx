import React, {useContext, useEffect, useState} from 'react';
import { Helmet } from 'react-helmet';
import {CenterAligner} from "../Layout";
import {Button, Checkbox, Form, Input} from "antd";
import {useIntl} from "react-intl";
import LoginContext from "../../contexts/LoginContext";
import styled from "styled-components";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import { Store } from 'antd/lib/form/interface';
import {ValidateErrorEntity} from "rc-field-form/lib/interface";
import history from "../../utils/history";

const Login: React.FC = () => {
    const intl = useIntl();
    const {state, login} = useContext(LoginContext);
    const [email, setEmail] = useState<string>('');
    const [pw, setPw] = useState<string>('');
    const [remember, setRemember] = useState<boolean>(true);

    const onFinish = (values: Store) => {
        login(values.email, values.pw, remember);
    };

    // @ts-ignore
    const handleChange = (changedFields: FieldData[], allFields: FieldData[]) => {
        if (changedFields.length == 0) return;

        const field = changedFields[0];

        switch(field.name[0]) {
            case 'email':
                setEmail(field.value);
                break;
            case 'pw':
                setPw(field.value);
                break;
        }
    }

    const handleCheckbox = (event: CheckboxChangeEvent) => {
        setRemember(event.target.checked);
    }

    useEffect(() => {
        if (!state.loading && state.isLoggedIn) {
            const pathname = history.location.pathname;
            const slash = pathname[pathname.length-1] === '/' ? '' : '/';
            history.push(`${history.location.pathname}${slash}..`);
        }
    }, [state]);

    return (

        <CenterAligner>
            <Helmet>
                <title>{intl.messages.login}</title>
            </Helmet>
            <Wrapper>
                <h1>{intl.messages.login}</h1>
                <Form
                    {...layout}
                    name="login"
                    size="large"
                    onFinish={onFinish}
                    onFieldsChange={handleChange}
                >
                    <Form.Item
                        label={`${intl.messages.email}`}
                        name="email"
                        rules={[{ required: true, message: `${intl.messages.emailRequired}` }, { type: "email", message: `${intl.messages.emailType}`}]}

                    >
                        <Input placeholder={`${intl.messages.emailPlaceholder}`} value={email} />
                    </Form.Item>
                    <Form.Item
                        label={`${intl.messages.pw}`}
                        name="pw"
                        rules={[{ required: true, message: `${intl.messages.pwRequired}` }]}
                    >
                        <Input.Password placeholder={`${intl.messages.pwPlaceholder}`} value={pw} />
                    </Form.Item>

                    <Form.Item {...tailLayout} name="remember">
                        <Checkbox checked={remember} onChange={handleCheckbox}>{intl.messages.rememberMe}</Checkbox>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            {intl.messages.login}
                        </Button>
                        <Button type="link" href="register" style={{float: "right"}}>{intl.messages.register}</Button>
                        <Button type="link" href="register" style={{float: "right"}}>{intl.messages.findPassword}</Button>
                    </Form.Item>
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
    max-width: 575px;
    label { color: ${(props) => props.theme.fontColor}!important };
`;

export default Login;