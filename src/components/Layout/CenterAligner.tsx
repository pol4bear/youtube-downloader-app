import React from 'react';
import {Spin} from 'antd';
import styled from "styled-components";

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Spinner: React.FC = () => {
    return (
        <Wrapper>
            <Spin size="large" />
        </Wrapper>
    )
}

export default Spinner;