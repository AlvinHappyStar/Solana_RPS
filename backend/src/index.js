const app = require('./app');
const https = require('http');
const fs = require('fs');

// var server = require('http').createServer(app);
// const port = process.env.PORT || 8080;
// server.listen(port, () => console.log(`Listening on port ${port}..`));

const httpsPort = 3306;
// const privateKey = fs.readFileSync('/etc/letsencrypt/live/degenparadiseflip.com/privkey.pem');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/degenparadiseflip.com/fullchain.pem');

// const credentials = {
//     key: privateKey,
//     cert: certificate,
// }

https.createServer(app)
    .listen(httpsPort, () => {
        console.log(`coinflip server is running at port ${httpsPort} as https.`);
    });
