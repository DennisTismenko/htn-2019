const admin = require('firebase-admin');
const serviceAccount = require("../serviceAccountKey.json");
const packageCollection = "packages";
const pkgNamingUtil = require('../util/pkgNamingUtil');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_URL,
});

const db = admin.firestore();

module.exports = {
    async create(pkgVersion, heuristics) {
        let ref = await db.collection(packageCollection).doc(pkgVersion).set({
            pkgId: pkgVersion,
            ...pkgNamingUtil.getNameVersion(pkgVersion),
            heuristics
        })
        return ref.id;
    },
    async fetchById (pkgVersion) {
        let pkgRef = db.collection(packageCollection).doc(pkgVersion);
        let pkg = await pkgRef.get();
        return pkg.exists ? pkg.data() : null;
    },
};
