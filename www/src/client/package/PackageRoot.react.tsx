import React, {useEffect, useMemo, useState} from 'react';
import Helmet from 'react-helmet';
import styled, {css} from 'styled-components';
import Disqus from 'disqus-react';
import groupBy from 'lodash/groupBy';
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
  PackageHeuristic,
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

const trustToString: {
  [key in 'yes' | 'no' | 'idk']: string;
} = {
  yes: 'low risk',
  idk: 'medium risk',
  no: 'high risk',
};

const colorBySeverity: {
  [key in 'high' | 'medium' | 'low' | 'none']:
    | 'green'
    | 'red'
    | 'orange'
    | 'yellow';
} = {
  high: 'red',
  medium: 'orange',
  low: 'yellow',
  none: 'green',
};

type CategoryLabel = 'security' | 'quality' | 'high risk' | 'medium risk' | 'low risk' | 'compliance';

const colorByCategory: {
  [key in CategoryLabel]: string;
} = {
  security: '#3F51B5',
  quality: '#FFC107',
  'high risk': '#F44336',
  'medium risk': '#CC8033',
  'low risk': '#DBDB70',
  compliance: '#00BCD4',
};

function HeuristicsGroup({group}: {group: PackageHeuristic[]}) {
  const [isShown, setIsShown] = useState(false);
  const {severity, category} = group[0];
  const categoryLabel: CategoryLabel = (category === 'risk' ? `${severity} ${category}` : category) as CategoryLabel;
  return (
    <Row>
      <Row>
        <HeuristicCategory color={colorByCategory[categoryLabel]}>
          <Text type="body" level={2} color="white" inline>
            {categoryLabel}
          </Text>
        </HeuristicCategory>
        <TextButton
          onClick={() => setIsShown(!isShown)}
          text={{type: 'body', level: 2}}
        >
          <strong>
            {JSON.parse(group[0].reference)
              .slice(0, 2)
              .join('@')}
          </strong>{' '}
          - {JSON.parse(group[0].reference)[2]}
        </TextButton>
      </Row>
      {isShown && (
        <>
          {Object.values(groupBy(group, 'reference'))
            .map(([heuristic]) => heuristic)
            .map(({message, severity, url}, index) => (
              <Row key={index}>
                <HeuristicRisk color={colorBySeverity[severity]} />
                {url != null ? (
                  <Text
                    type="body"
                    level={2}
                    color={colorBySeverity[severity]}
                    inline
                  >
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {message}
                    </a>
                  </Text>
                ) : (
                  <Text
                    type="body"
                    level={2}
                    color={colorBySeverity[severity]}
                    inline
                  >
                    {message}
                  </Text>
                )}
              </Row>
            ))}
          <Row />
        </>
      )}
    </Row>
  );
}

export default function PackageRoot() {
  const router = useRouter<PackageRootParams>();
  const {pkg, version} = router.match.params;
  const [
    packageAnalysis,
    setPackageAnalysis,
  ] = useState<PackageAnalysisModel | null>(null);
  const packageRepository = useMemo(() => new PackageRepository(), []);
  useEffect(() => {
    setPackageAnalysis(null);
    packageRepository.pkgByVersion(pkg, version).then(setPackageAnalysis);
  }, [packageRepository, pkg, version]);
  const disqusShortname = 'nodome-io';
  const disqusConfig = {
    title: `${pkg}@${version}`,
    identifier: `${pkg}@${version}`,
    url: `https://nodome.io${router.location.pathname}`,
  };
  const Shield = packageAnalysis ? ShieldByTrust[packageAnalysis.trust] : null;
  const heuristicsGroups =
    packageAnalysis &&
    Object.values(
      groupBy(packageAnalysis.heuristics, heuristic =>
        JSON.stringify(JSON.parse(heuristic.reference).slice(0, 3)),
      ),
    );
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
                <Text
                  type="body"
                  level={1}
                  color={colorByTrust[packageAnalysis.trust]}
                >
                  {trustToString[packageAnalysis.trust]}
                </Text>
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
            <Column width="70%" style={{overflowY: 'scroll', maxHeight: 640}}>
              {packageAnalysis.heuristics.length === 0 ? (
                <Row
                  style={{textAlign: 'center', marginTop: 70, maxWidth: 400}}
                >
                  <Text type="body" level={1} color="green">
                    Green! No security, compliance, quality, and risk issues
                    found.
                  </Text>
                </Row>
              ) : null}
              {heuristicsGroups &&
                heuristicsGroups.map((group, index) => (
                  <HeuristicsGroup key={index} group={group} />
                ))}
            </Column>
          </HeuristicsRoot>
        ) : (
          <HeuristicsRoot>
            <Row style={{textAlign: 'center', margin: '240px 0 320px'}}>
              <Text type="body" level={2} color="grey">
                Scanning package for security, compliance, quality, and risk
                issues...
              </Text>
            </Row>
          </HeuristicsRoot>
        )}
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

interface HeuristicRiskProps {
  color: 'red' | 'orange' | 'yellow' | 'green';
}

const HeuristicRisk = styled.span<HeuristicRiskProps>`
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 4px;
  border-radius: 50%;
  background-color: ${({color}) => color};
`;

interface HeuristicCategoryProps {
  color: string;
}

const HeuristicCategory = styled.span<HeuristicCategoryProps>`
  display: inline-block;
  vertical-align: top;
  padding: 0px 4px;
  border-radius: 16px;
  margin-right: 4px;
  background-color: ${({color}) => color};
`;

interface ColumnProps {
  width: string;
}

const Column = styled.div<ColumnProps>`
  display: inline-block;
  box-sizing: border-box;
  padding: 8px 0;
  width: ${({width}: ColumnProps) => width};
  vertical-align: top;
`;
