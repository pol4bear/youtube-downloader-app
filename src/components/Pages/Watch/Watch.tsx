import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { useLocation, useRouteMatch } from 'react-router';
import { Main } from '../../Layout';
import { VideoSuccessResult, ServerResponse } from '../Types';
import requestData from '../../../utils/requestData';
import LoadWrapper from '../../Layout/LoadWrapper';

interface MatchParams {
  lang?: string;
  id?: string;
}

const Watch: React.FC = () => {
  const intl = useIntl();
  const match = useRouteMatch<MatchParams>();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const id: string | null = match.params.id
    ? match.params.id
    : urlParams.get('v');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [data, setData] = useState<VideoSuccessResult | null>(null);
  const videoTitle = data ? data.title : intl.messages.failedtoLoad;
  const title = loading ? intl.messages.loading : videoTitle;

  if (id != null) {
    requestData<ServerResponse>('video.php', { v: id })
      .then((response) => {
        const result = response.data.result as VideoSuccessResult;
        setData(result);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  } else setLoading(false);

  return (
    <Main>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {loading ? (
        <LoadWrapper />
      ) : (
        <>
          {error && <p>error</p>}
          <p>hi</p>
        </>
      )}
    </Main>
  );
};

export default Watch;
