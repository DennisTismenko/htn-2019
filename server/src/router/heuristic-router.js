const express = require('express');
const heuristicService = require('../service/heuristic-service');
const npmRegistry = require('../data-pipeline/utility/npmRegistry');
const npmRegistryVersions = require('../data-pipeline/utility/npmRegistryVersions');
const router = new express.Router();

router.get('/:pkg/:version', async (req, res) => {
    try {
        const { pkg: pkgName, version: pkgVersion } = req.params;
        const pkg = await npmRegistry(pkgName, pkgVersion)
        const pkgVersions = await npmRegistryVersions(pkgName, pkgVersion)
        const heuristics = await heuristicService.runHeuristics(pkgName, pkgVersion);
        const trust = heuristics.some(({category, severity}) => (category === 'security' || category === 'risk') && severity === 'high')
            ? 'no'
            : heuristics.some(({category, severity}) => (category === 'quality' || category === 'risk') && severity === 'medium')
            ? 'idk'
            : 'yes';
        res.json({
            pkg,
            trust,
            versions: pkgVersions,
            latestVersion: pkgVersions[pkgVersions.length - 1],
            latestVersionTrust: 'idk',
            latestTrustedVersion: null,
            heuristics,
        })
        res.end(200);
    } catch (err) {
        console.error(err);
        res.json({
            message: err.message,
        });
        res.end(500);
    }
});

module.exports = router;