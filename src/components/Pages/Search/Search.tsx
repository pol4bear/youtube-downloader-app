import React, { useEffect, useState } from 'react';
import { useLocation, useRouteMatch } from 'react-router-dom';
import 'intersection-observer';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Col, Row, Skeleton } from 'antd';
import { Main } from '../../Layout';
import NotFound from '../../Layout/NotFound';
import SearchItemCard from './SearchItemCard';
import SearchContext, { SearchProvider } from './SearchContext';
import ErrorElement from '../../Layout/ErrorElement';
import LoadWrapper from '../../Layout/LoadWrapper';

interface MatchParams {
  lang?: string;
  query?: string;
}

const Search: React.FC = () => {
  const intl = useIntl();
  const match = useRouteMatch<MatchParams>();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const query: string | null = match.params.query
    ? match.params.query
    : urlParams.get('q');
  const { data, loading, more, error, setQuery, load } = React.useContext(
    SearchContext
  );
  const loader = React.useRef(load);
  const observer = React.useRef(
    /* eslint-disable no-unused-expressions */
    new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          loader.current && loader.current();
        }
      },
      { threshold: 1 }
    )
    /* eslint-enable no-unused-expressions */
  );
  const [element, setElement] = useState<Element | null>(null);

  if (setQuery) setQuery(query);

  useEffect(() => {
    loader.current = load;
  }, [load]);

  useEffect(() => {
    const currentElement = element;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [element]);

  if (!query)
    return (
      <Main>
        <NotFound />
      </Main>
    );
  if (error !== 0)
    return (
      <Main>
        <ErrorElement error={error} />
      </Main>
    );
  if (loading && data.length < 1) return <LoadWrapper />;
  return (
    <Main>
      <Helmet>
        <title>
          {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `${intl.messages.search} - ${query}`
          }
        </title>
      </Helmet>
      <Row justify="center">
        <Col xs={24} sm={24} md={24} lg={16}>
          {data.map((item) => (
            <SearchItemCard data={item} />
          ))}
          {loading && <Skeleton active />}
          {!loading && more && <span ref={setElement} />}
        </Col>
      </Row>
    </Main>
  );
};

export default () => {
  return (
    <SearchProvider>
      <Search />
    </SearchProvider>
  );
};
