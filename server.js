const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('./util/logger.js');
const cors = require('cors');
//const swaggerUi = require('swagger-ui-express');
//const swaggerDocument = require('./swagger/swagger.json');
app.use(cors());
app.get('/test', (req, res) => {
    res.send('BANK THE GOD');
})

//body json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// swagger
//app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', require('./router/index'));

const port = 5000;
const server = app.listen(port, () => {
    logger.info(`[API] Server ready @localhost:${port}`);
    logger.info('[Swagger] http://localhost:' + port + '/api-docs/')
})