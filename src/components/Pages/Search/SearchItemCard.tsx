import React from 'react';
import { Card, Col, Row } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faThumbsUp,
  faThumbsDown,
  faComment,
} from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router';
import { SearchItem } from './Types';

interface SearchItemCardProps {
  data: SearchItem;
}

const SearchItemCard: React.FC<SearchItemCardProps> = (props) => {
  /* eslint-disable react/no-danger */
  const { data } = props;
  const history = useHistory();
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
              <p>
                <FontAwesomeIcon icon={faPlay} />{' '}
                <span
                  dangerouslySetInnerHTML={{
                    __html: `${data.statistics.viewCount}`,
                  }}
                />
              </p>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <p>
                <FontAwesomeIcon icon={faComment} />{' '}
                <span
                  dangerouslySetInnerHTML={{
                    __html: `${data.statistics.commentCount}`,
                  }}
                />
              </p>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <p>
                <FontAwesomeIcon icon={faThumbsUp} />{' '}
                <span
                  dangerouslySetInnerHTML={{
                    __html: `${data.statistics.likeCount}`,
                  }}
                />
              </p>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <p>
                <FontAwesomeIcon icon={faThumbsDown} />{' '}
                <span
                  dangerouslySetInnerHTML={{
                    __html: `${data.statistics.dislikeCount}`,
                  }}
                />
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
  /* eslint-enable react/no-danger */
};

export default SearchItemCard;
