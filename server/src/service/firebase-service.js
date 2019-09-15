const admin = require('firebase-admin');
const serviceAccount = require("../serviceAccountKey.json");
const packageCollection = "packages";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_URL,
});

const db = admin.firestore();

function getNameVersion(pkgVersion) {
    let splitNameVersion = pkgVersion.split('@');
    return {
        name: splitNameVersion[0],
        version: splitNameVersion[1]
    }
}

module.exports = {
    create(pkgVersion, heuristics) {
        db.collection(packageCollection).doc(pkgVersion).set({
            pkgId: pkgVersion,
            ...getNameVersion(pkgVersion),
            heuristics
        })
    },
    fetchById (pkgVersion) {

    },
    fetchAllByName (pkgName) {

    }
};
