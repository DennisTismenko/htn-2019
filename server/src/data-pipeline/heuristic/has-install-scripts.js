module.exports = async function hasInstallScriptsHeuristic(context) {
  return [
    'preinstall',
    'install',
    'postinstall',
    'preuninstall',
    'uninstall',
    'postuninstall',
  ]
    .map((script) => [script, context.pkg.scripts && context.pkg.scripts[script]])
    .filter(([scriptName, script]) => script != null)
    .map(([scriptName, script]) => ({
      severity: 'high',
      category: 'risk',
      reference: JSON.stringify([context.pkg.name, context.pkg.version, `has-install-scripts/${scriptName}`, script]),
      message: `Lifecycle scripts which trigger on install can be useful but are inherently risky, as they may run unwanted CLI commands before other tools or the user can inspect the package. Package defines ${JSON.stringify(scriptName)}: ${JSON.stringify(script)}.`,
      url: `https://www.npmjs.com/package/${context.pkg.name}/v/${context.pkg.version}`,
    }))
}
