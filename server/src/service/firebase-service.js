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
    async fetchById(pkgVersion) {
        let pkgRef = db.collection(packageCollection).doc(pkgVersion);
        let pkg = await pkgRef.get();
        return pkg.exists ? pkg.data() : null;
    },
    async clearDatabase() {
        await deleteCollection(db, packageCollection, 20);
    },
};

function deleteCollection(db, collectionPath, batchSize) {
    let collectionRef = db.collection(collectionPath);
    let query = collectionRef.orderBy('__name__').limit(batchSize);
  
    return new Promise((resolve, reject) => {
      deleteQueryBatch(db, query, batchSize, resolve, reject);
    });
  }
  
  function deleteQueryBatch(db, query, batchSize, resolve, reject) {
    query.get()
      .then((snapshot) => {
        // When there are no documents left, we are done
        if (snapshot.size == 0) {
          return 0;
        }
  
        // Delete documents in a batch
        let batch = db.batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
  
        return batch.commit().then(() => {
          return snapshot.size;
        });
      }).then((numDeleted) => {
        if (numDeleted === 0) {
          resolve();
          return;
        }
  
        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(() => {
          deleteQueryBatch(db, query, batchSize, resolve, reject);
        });
      })
      .catch(reject);
  }
  