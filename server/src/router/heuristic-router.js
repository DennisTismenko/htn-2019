const express = require('express');
const heuristicService = require('../service/heuristic-service');
const npmRegistry = require('../data-pipeline/utility/npmRegistry');
const router = new express.Router();

router.get('/:pkg/:version', async (req, res) => {
    try {
        const { pkg: pkgName, version: pkgVersion } = req.params;
        const pkg = await npmRegistry(pkgName, pkgVersion)
        const lastestPkg = await npmRegistry(pkgName, 'latest')
        const heuristics = await heuristicService.runHeuristics(pkgName, pkgVersion);
        const trust = heuristics.length > 10 ? 'no' : heuristics.length > 3 ? 'idk' : 'yes';
        res.json({
            pkg,
            trust,
            latestVersion: lastestPkg.version,
            latestVersionTrust: trust === 'yes' ? (Math.random() > 0.5 ? 'yes' : 'no') : trust,
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