#!/usr/bin/env node
// Fichero src/index.js

// Importamos los dos módulos de NPM necesarios para trabajar
const express = require('express');
const cors = require('cors');
const MYSQL = require('mysql2/promise');

// Creamos el servidor
const server = express();

// Configuramos el servidor
server.use(cors());
server.use(express.json({ limit: '50mb' }));
server.set('view engine', 'ejs');

// Arrancamos el servidor en el puerto indicado o en 3000
const serverPort = process.env.PORT || 3000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

const connectMySQL = () => {
  const connectionData = {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  };

  return MYSQL.createConnection(connectionData)
    .then((connection) => connection.connect())
    .then((connection) => {
      console.log('Connected with the following id: ' + connection.threadId);

      return connection;
    })
    .catch((error) => {
      console.error('Error connecting with database: ' + error.code);
      console.log(error.stack);

      throw error;
    });
};

// Endpoints
server.get('/', showList);

function showList(req, res) {
  connectMySQL()
    .then((db) => {
      const query = 'SELECT * FROM posts LIMIT ?';

      db.promise()
        .query(query, [10])
        .then(([posts]) => {
          console.log(posts);
          res.render('showList', { posts });
        });
    })
    .catch((error) => {
      res.render('showError', { error: error });
    });
}
