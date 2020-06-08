import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Main } from '../../Layout';
import { VideoSuccessResult } from '../Types';

const Watch: React.FC = () => {
  const intl = useIntl();
  const [loading] = useState<boolean>(true);
  const [data] = useState<VideoSuccessResult | null>(null);
  const videoTitle = data ? data.title : intl.messages.failedtoLoad;
  const title = loading ? intl.messages.loading : videoTitle;

  return (
    <Main>
      <Helmet>
        <title>{title}</title>
      </Helmet>
    </Main>
  );
};

export default Watch;
