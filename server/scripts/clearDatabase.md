from `server` directory

```
node -r dotenv/config -e 'require("./src/service/firebase-service.js").clearDatabase().then(() => console.log("Done"))'
```