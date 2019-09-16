const gitTags = require('../utility/gitTags');

const sanitizeTagVersion = (tag) => {
  return tag.trim().replace(/^v(\d)/, '$1').toLowerCase();
}

module.exports = async function scmTaggedVersions(context) {
  if (context.repoDir == null) {
    return [];
  }
  const tags = await gitTags(context.repoDir);
  if (tags.map(sanitizeTagVersion).includes(sanitizeTagVersion(context.pkg.version))) {
    return [];
  }
  return [{
    severity: 'medium',
    message: 'Package version does not have a corresponding tag in source control repository.',
    category: 'quality',
    reference: JSON.stringify([context.pkg.name, context.pkg.version, 'scm-tagged-versions', context.pkg.version]),
    url: `https://www.npmjs.com/package/${context.pkg.name}/v/${context.pkg.version}`,
  }];
}
