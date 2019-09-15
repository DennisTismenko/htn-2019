import React, {useEffect, useMemo, useState} from 'react';
import Helmet from 'react-helmet';
import styled, {css} from 'styled-components';
import Disqus from 'disqus-react';
import {useRouter} from '../core/routing/useRouter';
import {PackageRootParams, packageRoute} from './packageRoute';
import {urlBuilder} from '../core/routing/urlBuilder';
import {homeRoute} from '../home/homeRoute';
import {Text} from '../core/components/text/Text.react';
import {TextButton} from '../core/components/inputs/TextButton.react';
import {PackageSearch} from './components/PackageSearch.react';
import {
  PackageRepository,
  PackageAnalysisModel,
} from './repositories/PackageRepository';
import ShieldCheckIcon from './shieldCheck.svg';
import ShieldCrossIcon from './shieldCheck.svg';
import ShieldQuestionIcon from './shieldCheck.svg';

const shieldCSS = css`
  padding: 8px;
  border: 8px solid;
  width: 80px;
  border-radius: 50%;
`;

const ShieldCheck = styled(ShieldCheckIcon)`
  ${shieldCSS}
  border-color: #33aa33;
  fill: #33aa33;
`;

const ShieldCross = styled(ShieldCrossIcon)`
  ${shieldCSS}
  border: 8px solid #cc3333;
  fill: #cc3333;
`;

const ShieldQuestion = styled(ShieldQuestionIcon)`
  ${shieldCSS}
  border: 8px solid #cc8033;
  fill: #cc8033;
`;

const ShieldByTrust = {
  yes: ShieldCheck,
  no: ShieldCross,
  idk: ShieldQuestion,
};

const colorByTrust: {
  [key in 'yes' | 'no' | 'idk']: 'green' | 'red' | 'orange';
} = {
  yes: 'green',
  no: 'red',
  idk: 'orange',
};

export default function PackageRoot() {
  const router = useRouter<PackageRootParams>();
  const {pkg, version} = router.match.params;
  const [
    packageAnalysis,
    setPackageAnalysis,
  ] = useState<PackageAnalysisModel | null>(null);
  const packageRepository = useMemo(() => new PackageRepository(), []);
  useEffect(() => {
    packageRepository.pkgByVersion(pkg, version).then(setPackageAnalysis);
  }, [packageRepository, pkg, version]);
  const disqusShortname = 'nodome-io';
  const disqusConfig = {
    title: `${pkg}@${version}`,
    identifier: `${pkg}@${version}`,
    url: `https://nodome.io${router.location.pathname}`,
  };
  const Shield = packageAnalysis ? ShieldByTrust[packageAnalysis.trust] : null;
  return (
    <>
      <Helmet>
        <title>
          {pkg}@{version} - nodome.io
        </title>
      </Helmet>
      <Root>
        <SearchRoot>
          <Row>
            <TextButton
              link={{to: urlBuilder(homeRoute.path)}}
              text={{type: 'headline', level: 2}}
            >
              &lt; nodome.io
            </TextButton>
          </Row>
          <Row />
          <Row>
            <Text type="headline" level={1}>
              {pkg}@{version}
            </Text>
          </Row>
          <Row>
            <Text type="body" level={1} ellipsis>
              {packageAnalysis != null ? packageAnalysis.pkg.description : ' '}
            </Text>
          </Row>
          <Row />
          <Row>
            <PackageSearch defaultQuery={`${pkg}@${version}`} />
          </Row>
        </SearchRoot>
        {packageAnalysis != null ? (
          <HeuristicsRoot>
            <Column width="30%" style={{textAlign: 'center'}}>
              <Row>{Shield != null ? <Shield /> : null}</Row>
              <Row>
                <TextButton
                  link={{
                    to: urlBuilder(packageRoute.path, {
                      pkg,
                      version,
                    }),
                  }}
                  text={{
                    type: 'headline',
                    level: 1,
                    color: colorByTrust[packageAnalysis.trust],
                  }}
                >
                  {version}
                </TextButton>
              </Row>
              <Row>
                <Text type="body" level={1} color="grey">
                  current
                </Text>
              </Row>
              {packageAnalysis.latestTrustedVersion != null &&
              packageAnalysis.latestTrustedVersion !==
                packageAnalysis.latestVersion ? (
                  <>
                    <Row />
                    <Row />
                    <Row>
                      <TextButton
                        link={{
                        to: urlBuilder(packageRoute.path, {
                          pkg,
                          version: packageAnalysis.latestTrustedVersion,
                        }),
                      }}
                        text={{type: 'headline', level: 2, color: 'green'}}
                      >
                        {packageAnalysis.latestTrustedVersion}
                      </TextButton>
                    </Row>
                    <Row>
                      <Text type="body" level={1} color="grey">
                      latest vetted
                      </Text>
                    </Row>
                  </>
              ) : null}
              {packageAnalysis.latestVersion != null &&
              packageAnalysis.latestVersion !== version ? (
                <>
                  <Row />
                  <Row />
                  <Row>
                    <TextButton
                      link={{
                        to: urlBuilder(packageRoute.path, {
                          pkg,
                          version: packageAnalysis.latestVersion,
                        }),
                      }}
                      text={{
                        type: 'headline',
                        level: 2,
                        color: colorByTrust[packageAnalysis.latestVersionTrust],
                      }}
                    >
                      {packageAnalysis.latestVersion}
                    </TextButton>
                  </Row>
                  <Row>
                    <Text type="body" level={1} color="grey">
                      latest
                    </Text>
                  </Row>
                </>
              ) : null}
            </Column>
            <Column width="70%">
              {/* Green, Red, Orange bullet points go here from heuristics array */}
            </Column>
          </HeuristicsRoot>
        ) : null}
        <DiscussionRoot>
          <Disqus.CommentCount
            shortname={disqusShortname}
            config={disqusConfig}
          />
          <Disqus.DiscussionEmbed
            shortname={disqusShortname}
            config={disqusConfig}
          />
        </DiscussionRoot>
      </Root>
    </>
  );
}

const Root = styled.div`
  padding: 32px 16px;
  margin: auto;
  max-width: 960px;
`;

const SearchRoot = styled.div`
  margin: auto;
  max-width: 640px;
`;

const HeuristicsRoot = styled.div`
  margin: 64px 0;
`;

const DiscussionRoot = styled.div`
  margin: 64px 0;
`;

const Row = styled.div`
  margin: 8px 0;
  min-height: 1px;
`;

interface ColumnProps {
  width: string;
}

const Column = styled.div<ColumnProps>`
  display: inline-block;
  box-sizing: border-box;
  padding: 8px 0;
  width: ${({width}: ColumnProps) => width};
`;
