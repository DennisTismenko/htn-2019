module.exports = async function scmMissing(context) {
  if (context.pkg.repository != null && context.repoDir != null) {
    return [];
  }
  return [{
    severity: 'high',
    message: 'Package does not have a source control repository defined within its package.json.',
    category: 'quality',
    reference: JSON.stringify({
      'scm-missing': true,
    }),
  }];
}
