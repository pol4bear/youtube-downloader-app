import React from 'react';
import { Card, Col, Row } from 'antd';
import { SearchItem } from './Types';

interface SearchItemCardProps {
  data: SearchItem;
}

const SearchItemCard: React.FC<SearchItemCardProps> = (props) => {
  /* eslint-disable react/no-danger */
  const { data } = props;
  return (
    <Card
      style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
      hoverable
    >
      <Row gutter={[16, 24]}>
        <Col span={6}>
          <img alt="Thumbnail" src={data.thumbnails.high.url} width="100%" />
        </Col>
        <Col span={18}>
          <Row>
            <Col span={24}>
              <h1 dangerouslySetInnerHTML={{ __html: data.title }} />
            </Col>
            <Col span={24}>
              <p dangerouslySetInnerHTML={{ __html: data.description }} />
            </Col>
            <Col span={6}>
              <p
                dangerouslySetInnerHTML={{
                  __html: `${data.statistics.viewCount}`,
                }}
              />
            </Col>
            <Col span={6}>
              <p
                dangerouslySetInnerHTML={{
                  __html: `${data.statistics.likeCount}`,
                }}
              />
            </Col>
            <Col span={6}>
              <p
                dangerouslySetInnerHTML={{
                  __html: `${data.statistics.dislikeCount}`,
                }}
              />
            </Col>
            <Col span={6}>
              <p
                dangerouslySetInnerHTML={{
                  __html: `${data.statistics.commentCount}`,
                }}
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
