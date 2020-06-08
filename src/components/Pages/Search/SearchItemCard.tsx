import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faThumbsUp,
  faThumbsDown,
  faComment,
} from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router';
import { useIntl } from 'react-intl';
import { SearchItem } from '../Types';

interface SearchItemCardProps {
  data: SearchItem;
}

const SearchItemCard: React.FC<SearchItemCardProps> = (props) => {
  /* eslint-disable react/no-danger */
  const intl = useIntl();
  const { data } = props;
  const history = useHistory();
  const statistics = data.statistics
    ? data.statistics
    : { viewCount: 0, likeCount: 0, dislikeCount: 0, commentCount: 0 };
  return (
    <Card
      style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
      onClick={() => {
        history.push(`../watch/${data.id}`);
      }}
      hoverable
    >
      <Row gutter={[16, 24]}>
        <Col xs={12} sm={12} md={8} lg={6}>
          <img alt="Thumbnail" src={data.thumbnails.high.url} width="100%" />
        </Col>
        <Col xs={12} sm={12} md={16} lg={18}>
          <Row>
            <Col span={24}>
              <h1 dangerouslySetInnerHTML={{ __html: data.title }} />
            </Col>
            <Col span={24}>
              <p dangerouslySetInnerHTML={{ __html: data.description }} />
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
    </Card>
  );
  /* eslint-enable react/no-danger */
};

export default SearchItemCard;
