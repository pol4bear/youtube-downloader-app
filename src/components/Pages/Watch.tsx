import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { useLocation, useRouteMatch } from 'react-router';
import axios, { AxiosError } from 'axios';
import { Button, Card, Col, Row, Statistic, Select, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComment,
  faPlay,
  faThumbsDown,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { Main, ErrorContent, LoadWrapper } from '../Layout';
import { VideoInfo, ServerResponse, Dictionary } from '../../types';
import requestData from '../../utils/requestData';
import config from '../../common/config';

interface MatchParams {
  lang?: string;
  id?: string;
}

const { Option } = Select;

const Watch: React.FC = () => {
  const intl = useIntl();
  const match = useRouteMatch<MatchParams>();
  const location = useLocation();

  /**
   * URL parameters.
   */
  const urlParams = new URLSearchParams(location.search);

  /**
   * Video id.
   */
  const id: string | null = match.params.id
    ? match.params.id
    : urlParams.get('v');

  /**
   * Make loading wrapper visible.
   */
  const [loading, setLoading] = useState<boolean>(true);
  /**
   * Check if request started.
   */
  const [requested, setRequested] = useState<boolean>(false);
  /**
   * Check if error was throned while request.
   */
  const [error, setError] = useState<number>(0);
  /**
   * Response data.
   */
  const [data, setData] = useState<VideoInfo | null>(null);
  /**
   * Video quality to download.
   */
  const [quality, setQuality] = useState<string>('');
  /**
   * Download state.
   */
  const [downloading, setDownloading] = useState<boolean>(false);

  /**
   * Handle quality select change.
   *
   * @param value
   */
  const onQualityChange = (value: string) => {
    setQuality(value);
  };

  /**
   * Make download of selected video.
   */
  const makeDownload = () => {
    const key = 'updatable';
    setDownloading(true);
    message
      .loading({ content: intl.messages.downloading, key, duration: 0 })
      .then(
        () => {
          return null;
        },
        () => {
          return null;
        }
      );

    axios({
      url: `${config.serverUrl}/download${config.serverSuffix}?v=${
        data!.id
      }&quality=${quality}`,
      method: 'GET',
      responseType: 'blob',
    })
      .then((response) => {
        const headers = response.headers as Dictionary<string>;
        const url = window.URL.createObjectURL(new Blob([response.data]));
        let filename = 'unnamed';

        if (headers['content-disposition']) {
          const contentDisposition = headers['content-disposition'].split(
            "filename*=UTF-8''"
          );
          if (contentDisposition.length === 2)
            filename = decodeURIComponent(contentDisposition[1]);
        }
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        message
          .success({ content: intl.messages.downloadSuccess, key, duration: 2 })
          .then(
            () => {
              return null;
            },
            () => {
              return null;
            }
          );
        setDownloading(false);
      })
      .catch(() => {
        message
          .error({ content: intl.messages.downloadFailed, key, duration: 2 })
          .then(
            () => {
              return null;
            },
            () => {
              return null;
            }
          );
      });
  };

  // If is loading return loading wrapper.
  if (loading) {
    // If id not set stop loading.
    if (id === null) setLoading(false);
    // If is request not started start request.
    else if (!requested) {
      setRequested(true);
      requestData<ServerResponse<VideoInfo>>(`video${config.serverSuffix}`, {
        v: id,
      })
        .then((response) => {
          const result = response.data.data as VideoInfo;
          setData(result);
          if (result.qualities)
            setQuality(
              result.qualities[result.qualities.length - 1].formatCode
            );
          setLoading(false);
        })
        .catch((e: AxiosError<ServerResponse<VideoInfo>>) => {
          let errno = -1;
          if (e.response) {
            if (e.response.data.success) {
              const errorInfo = e.response.data.error;
              errno = errorInfo ? errorInfo.code : errno;
            }
          }
          setError(errno);
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
  // If error throned while request return error content
  if (error !== 0 || data === null || data.qualities === null)
    return (
      <Main>
        <ErrorContent error={error} />
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
              <Col xs={24} sm={24} md={24} lg={8}>
                <img
                  alt="Thumbnail"
                  src={data.thumbnails.high.url}
                  width="100%"
                />
              </Col>
              <Col xs={24} sm={24} md={24} lg={16}>
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
                  <Col span={12}>
                    <Statistic
                      title={intl.messages.viewCount as string}
                      value={statistics.viewCount}
                      prefix={<FontAwesomeIcon icon={faPlay} />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title={intl.messages.commentCount as string}
                      value={statistics.commentCount}
                      prefix={<FontAwesomeIcon icon={faComment} />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title={intl.messages.likeCount as string}
                      value={statistics.likeCount}
                      prefix={<FontAwesomeIcon icon={faThumbsUp} />}
                    />
                  </Col>
                  <Col span={12}>
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
                disabled={downloading}
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
                disabled={downloading}
                onClick={makeDownload}
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
