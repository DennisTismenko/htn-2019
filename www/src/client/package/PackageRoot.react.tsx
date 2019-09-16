import React, {useEffect, useMemo, useState} from 'react';
import Helmet from 'react-helmet';
import styled, {css} from 'styled-components';
import Disqus from 'disqus-react';
import groupBy from 'lodash/groupBy';
import {useRouter} from '../core/routing/useRouter';
import {PackageRootParams, packageRoute} from './packageRoute';
import {urlBuilder} from '../core/routing/urlBuilder';
import {homeRoute} from '../home/homeRoute';
import {Text, TextProps} from '../core/components/text/Text.react';
import {Badge} from '../core/components/text/Badge.react';
import {TextButton} from '../core/components/inputs/TextButton.react';
import {GitHubIcon} from '../core/components/social/GitHubIcon.react';
import {PackageSearch} from './components/PackageSearch.react';
import {
  PackageRepository,
  PackageHeuristicsResponse,
  PackageHeuristic,
} from './repositories/PackageRepository';
import ShieldIcon from './Shield.svg';
import {TextInput} from '../core/components/inputs/TextInput.react';

const shieldCSS = css`
  padding: 8px;
  border: 8px solid;
  width: 80px;
  border-radius: 50%;
`;

const ShieldCheck = styled(ShieldIcon)`
  ${shieldCSS}
  border-color: #33aa33;
  fill: #33aa33;
`;

const ShieldCross = styled(ShieldIcon)`
  ${shieldCSS}
  border: 8px solid #cc3333;
  fill: #cc3333;
`;

const ShieldQuestion = styled(ShieldIcon)`
  ${shieldCSS}
  border: 8px solid #cc8033;
  fill: #cc8033;
`;

const ShieldByTrust = {
  yes: ShieldCheck,
  no: ShieldCross,
  idk: ShieldQuestion,
};

const trustToColor: {
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

const severityToColor: {
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

type CategoryLabel =
  | 'security'
  | 'quality'
  | 'high risk'
  | 'medium risk'
  | 'low risk'
  | 'compliance';

const categoryLabelToColor: {
  [key in CategoryLabel]: string;
} = {
  security: '#3F51B5',
  quality: '#FFC107',
  compliance: '#00BCD4',
  'high risk': '#F44336',
  'medium risk': '#CC8033',
  'low risk': '#DBDB70',
};

function HeuristicsGroup({group}: {group: PackageHeuristic[]}) {
  const [isShown, setIsShown] = useState(false);
  const {severity, category} = group[0];
  const categoryLabel: CategoryLabel = (category === 'risk'
    ? `${severity} ${category}`
    : category) as CategoryLabel;
  return (
    <Row>
      <Row>
        <Badge color={categoryLabelToColor[categoryLabel]}>
          <Text type="body" level={2} color="white" inline>
            {categoryLabel}
          </Text>
        </Badge>
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
            .map((heuristic, index) => (
              <Row key={index}>
                <HeuristicRisk color={severityToColor[heuristic.severity]} />
                {heuristic.url != null ? (
                  <Text
                    type="body"
                    level={2}
                    color={severityToColor[heuristic.severity]}
                    inline
                  >
                    <a
                      href={heuristic.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {heuristic.message}
                    </a>
                  </Text>
                ) : (
                  <Text
                    type="body"
                    level={2}
                    color={severityToColor[heuristic.severity]}
                    inline
                  >
                    {heuristic.message}
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
  ] = useState<PackageHeuristicsResponse | null>(null);
  const packageRepository = useMemo(() => new PackageRepository(), []);
  useEffect(() => {
    setPackageAnalysis(null);
    packageRepository.pkgByVersion(pkg, version).then(setPackageAnalysis);
  }, [packageRepository, pkg, version]);

  const titleEl = (
    <title>
      {pkg}@{version} - nodome.io
    </title>
  );

  const [versionQuery, setVersionQuery] = useState(version);
  useEffect(() => {
    setVersionQuery(version);
  }, [version]);
  const versionOptions = useMemo(
    () =>
      (packageAnalysis && packageAnalysis.message == null
        ? packageAnalysis.versions
            .map(someVersion => ({key: someVersion, value: someVersion}))
            .concat([
              {
                key:
                  packageAnalysis.versions[packageAnalysis.versions.length - 1],
                value: 'latest',
              },
            ])
        : [{key: version, value: version}]
      ).reverse(),
    [packageAnalysis, version],
  );
  const searchRootEl = (
    <SearchRoot>
      <Row style={{display: 'flex', justifyContent: 'space-between'}}>
        <TextButton
          link={{to: urlBuilder(homeRoute.path)}}
          text={{type: 'headline', level: 2, inline: true}}
        >
          nodome.io
        </TextButton>
        <GitHubIcon />
      </Row>
      <Row />
      <Row>
        <PackageSearch defaultQuery={pkg} />
      </Row>
      <Row />
      <Row>
        <a
          href={`https://npmjs.com/package/${encodeURIComponent(
            pkg,
          )}/v/${encodeURIComponent(version)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{textDecoration: 'none', display: 'inline-block'}}
        >
          <Text type="headline" level={1} inline>
            {pkg}@
          </Text>
        </a>
        <div style={{display: 'inline-block', maxWidth: 240}}>
          <Text type="headline" level={1}>
            <TextInput
              variant="unstyled"
              value={versionQuery}
              onChange={setVersionQuery}
              options={versionOptions}
              onOptionClick={({key}) => {
                router.history.push(
                  urlBuilder(packageRoute.path, {
                    pkg,
                    version: key,
                  }),
                );
              }}
            />
          </Text>
        </div>
      </Row>
    </SearchRoot>
  );

  const disqusShortname = 'nodome-io';
  const disqusConfig = {
    title: `${pkg}@${version}`,
    identifier: `${pkg}@${version}`,
    url: `https://nodome.io${router.location.pathname}`,
  };
  const discussionRootEl = (
    <DiscussionRoot>
      <Disqus.CommentCount shortname={disqusShortname} config={disqusConfig} />
      <Disqus.DiscussionEmbed
        shortname={disqusShortname}
        config={disqusConfig}
      />
    </DiscussionRoot>
  );

  const eslintParseError =
    packageAnalysis &&
    packageAnalysis.message == null &&
    packageAnalysis.heuristics.find(
      ({reference}) => JSON.parse(reference)[2] === 'eslint/null',
    );
  let takeoverMessage: {
    text: TextProps;
    message: string;
    textAlign: 'left' | 'center';
  } | null = null;

  if (eslintParseError) {
    takeoverMessage = {
      text: {
        type: 'body',
        level: 1,
        color: 'red',
      },
      textAlign: 'left',
      message:
        "ESLint couldn't parse some of the JavaScript in this package. We plan to add support for experimental features and popular flavors of JavaScript, however, as of right now we only support Node.js.",
    };
  }

  if (packageAnalysis == null) {
    takeoverMessage = {
      text: {
        type: 'body',
        level: 2,
        color: 'grey',
      },
      textAlign: 'center',
      message:
        'Scanning package for security, compliance, quality, and risk issues...',
    };
  } else if (packageAnalysis.message != null) {
    takeoverMessage = {
      text: {
        type: 'body',
        level: 1,
        color: 'red',
      },
      textAlign: 'left',
      message: packageAnalysis.message,
    };
  }

  if (takeoverMessage != null) {
    return (
      <>
        <Helmet>{titleEl}</Helmet>
        <Root>
          {searchRootEl}
          <HeuristicsRoot>
            <Row
              style={{
                textAlign: takeoverMessage.textAlign,
                maxWidth: 640,
                margin: '180px auto 0',
              }}
            >
              <Text {...takeoverMessage.text}>{takeoverMessage.message}</Text>
            </Row>
          </HeuristicsRoot>
          {discussionRootEl}
        </Root>
      </>
    );
  }

  if (packageAnalysis == null || packageAnalysis.message != null) {
    throw new Error('Invariant violation packageAnalysis must be populated.');
  }

  const Shield = ShieldByTrust[packageAnalysis.trust];
  const heuristicsGroups = Object.values(
    groupBy(packageAnalysis.heuristics, heuristic =>
      JSON.stringify(JSON.parse(heuristic.reference).slice(0, 3)),
    ),
  );

  return (
    <>
      <Helmet>{titleEl}</Helmet>
      <Root>
        {searchRootEl}
        <HeuristicsRoot>
          <Column width="30%" mobileWidth="100%" style={{textAlign: 'center'}}>
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
                  color: trustToColor[packageAnalysis.trust],
                }}
              >
                {version}
              </TextButton>
            </Row>
            <Row>
              <Text
                type="body"
                level={1}
                color={trustToColor[packageAnalysis.trust]}
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
                      color: trustToColor[packageAnalysis.latestVersionTrust],
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
          <Column
            width="70%"
            mobileWidth="100%"
            style={{overflowY: 'scroll', maxHeight: 560}}
          >
            {packageAnalysis.heuristics.length === 0 ? (
              <Row
                style={{
                  textAlign: 'center',
                  marginTop: 70,
                  maxWidth: 400,
                }}
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
        {discussionRootEl}
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
  box-sizing: border-box;
  padding: 64px 0;
  min-height: 688px;
`;

const DiscussionRoot = styled.div`
  padding: 32px 0;
`;

const Row = styled.div`
  padding: 4px 0;
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

interface ColumnProps {
  width: string;
  mobileWidth?: string;
}

const Column = styled.div<ColumnProps>`
  display: inline-block;
  box-sizing: border-box;
  padding: 8px 0;
  width: ${({width}: ColumnProps) => width};
  vertical-align: top;
  ${({mobileWidth}) =>
    mobileWidth
      ? `
    @media screen and (max-width: 767px) {
      width: ${mobileWidth}
    }
  `
      : ''}
`;
