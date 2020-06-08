import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { useLocation, useRouteMatch } from 'react-router';
import { AxiosError } from 'axios';
import { Main } from '../../Layout';
import { VideoSuccessResult, ServerResponse, FailResult } from '../Types';
import requestData from '../../../utils/requestData';
import LoadWrapper from '../../Layout/LoadWrapper';
import NotFound from '../../Layout/NotFound';

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
  const [error, setError] = useState<number>(0);
  const [data, setData] = useState<VideoSuccessResult | null>(null);
  const [title, setTitle] = useState<string>(intl.messages.loading as string);
  const failedToLoadTitle = intl.messages.failedToLoad
    ? (intl.messages.failedToLoad as string)
    : 'Failed to load';

  if (id != null) {
    requestData<ServerResponse>('video.php', { v: id })
      .then((response) => {
        const result = response.data.result as VideoSuccessResult;
        setData(result);
        setTitle(result.title);
        setLoading(false);
      })
      .catch((e: AxiosError<ServerResponse>) => {
        if (e.response) {
          const result = e.response.data.result as FailResult;
          setError(result.code);
        } else setError(-1);
        setTitle(failedToLoadTitle);
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
          {error === 2 || (error === -1 && <p>Not Available</p>)}
          {error === 3 && <NotFound />}
          {data !== null && <p>hi</p>}
        </>
      )}
    </Main>
  );
};

export default Watch;
