import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { useLocation, useRouteMatch } from 'react-router';
import { AxiosError } from 'axios';
import { Button, Card, Col, Row, Statistic, Select } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComment,
  faPlay,
  faThumbsDown,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { Main } from '../Layout';
import { VideoSuccessResult, ServerResponse, FailResult } from './Types';
import requestData from '../../utils/requestData';
import LoadWrapper from '../Layout/LoadWrapper';
import config from '../../common/Config';
import ErrorElement from '../Layout/ErrorElement';

interface MatchParams {
  lang?: string;
  id?: string;
}

const { Option } = Select;

const Watch: React.FC = () => {
  const intl = useIntl();
  const match = useRouteMatch<MatchParams>();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const id: string | null = match.params.id
    ? match.params.id
    : urlParams.get('v');
  const [loading, setLoading] = useState<boolean>(true);
  const [requested, setRequested] = useState<boolean>(false);
  const [error, setError] = useState<number>(0);
  const [data, setData] = useState<VideoSuccessResult | null>(null);
  const [quality, setQuality] = useState<string>('');

  const onQualityChange = (value: string) => {
    setQuality(value);
  };

  if (loading) {
    if (id === null) setLoading(false);
    else if (!requested) {
      setRequested(true);
      requestData<ServerResponse>('video.php', { v: id })
        .then((response) => {
          const result = response.data.result as VideoSuccessResult;
          setData(result);
          setQuality(result.qualities[result.qualities.length - 1].formatCode);
          setLoading(false);
        })
        .catch((e: AxiosError<ServerResponse>) => {
          if (e.response) {
            if (e.response.data.success) {
              const result = e.response.data.result as FailResult;
              setError(result.code);
            } else setError(-1);
          } else setError(-1);
          setLoading(false);
        });
    }
    return (
      <Main>
        <Helmet>
          <title>{intl.messages.loading as string}</title>
        </Helmet>
        <LoadWrapper />
      </Main>
    );
  }
  if (error !== 0 || data === null)
    return (
      <Main>
        <ErrorElement error={error} />
      </Main>
    );

  const statistics = data.statistics
    ? data.statistics
    : { viewCount: 0, likeCount: 0, dislikeCount: 0, commentCount: 0 };
  return (
    <Main>
      <Helmet>
        <title>{data.title}</title>
      </Helmet>
      <Row justify="center" style={{ width: '100%' }}>
        <Col xs={24} sm={24} md={24} lg={16}>
          <Card
            style={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}
          >
            <Row gutter={[16, 24]}>
              <Col xs={12} sm={12} md={8} lg={6}>
                <img
                  alt="Thumbnail"
                  src={data.thumbnails.high.url}
                  width="100%"
                />
              </Col>
              <Col xs={12} sm={12} md={16} lg={18}>
                <Row>
                  <Col span={24}>
                    <h1 dangerouslySetInnerHTML={{ __html: data.title }} />
                  </Col>
                  <Col span={24}>
                    <pre
                      style={{ whiteSpace: 'pre-wrap' }}
                      dangerouslySetInnerHTML={{ __html: data.description }}
                    />
                  </Col>
                  <Col xs={12} sm={12} md={6} lg={6}>
                    <Statistic
                      title={intl.messages.viewCount as string}
                      value={statistics.viewCount}
                      prefix={<FontAwesomeIcon icon={faPlay} />}
                    />
                  </Col>
                  <Col xs={12} sm={12} md={6} lg={6}>
                    <Statistic
                      title={intl.messages.commentCount as string}
                      value={statistics.commentCount}
                      prefix={<FontAwesomeIcon icon={faComment} />}
                    />
                  </Col>
                  <Col xs={12} sm={12} md={6} lg={6}>
                    <Statistic
                      title={intl.messages.likeCount as string}
                      value={statistics.likeCount}
                      prefix={<FontAwesomeIcon icon={faThumbsUp} />}
                    />
                  </Col>
                  <Col xs={12} sm={12} md={6} lg={6}>
                    <Statistic
                      title={intl.messages.dislikeCount as string}
                      value={statistics.dislikeCount}
                      prefix={<FontAwesomeIcon icon={faThumbsDown} />}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Select
                defaultValue={quality}
                onChange={onQualityChange}
                size="large"
                style={{ width: '100%' }}
              >
                {data.qualities.map((item) => (
                  <Option
                    value={item.formatCode}
                  >{`${item.resolution} - ${item.extension} - ${item.note}`}</Option>
                ))}
              </Select>
            </Row>
            <Row>
              <DownloadButton
                href={`${config.serverUrl}/download.php?v=${data.id}&quality=${quality}`}
                target="_blank"
                size="large"
                block
              >
                {intl.messages.download}
              </DownloadButton>
            </Row>
          </Card>
        </Col>
      </Row>
    </Main>
  );
};

const DownloadButton = styled(Button)`
  background-color: ${(props) => props.theme.fontColor};
  color: ${(props) => props.theme.background};
  height: 40px;
  margin-top: 15px;

  &:hover,
  &:focus {
    background-color: ${(props) => props.theme.fontColor};
    border: none;
    color: #1abc9c;
  }
`;

export default Watch;
