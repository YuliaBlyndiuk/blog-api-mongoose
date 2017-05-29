const express = require('express');
const mongoose = require('mongoose');
const app = express();
mongoose.Promise = global.Promise;


const {PORT, DATABASE_URL} = require('./config');
const {post} = require('./models');

app.get('/blog-posts', (req, res) => {
	
	var result = post.find()
		.then((result) => {
			console.log(result)
			res.json(result);
		})
		.catch((error) => {
			console.log(error);
			res.sendStatus(500)
		})
	
});


let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if(err) {
				return reject(err);
			}

			server = app.listen(port, () => {
				console.log('Your app is listening n port ${port}');
				resolve();
			})
			.on('error', err => {
				mongoose.disconnect();
				reject(err);
			}); 
		});
	});
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if(require.main === module) {
	runServer().catch(err => console.error(err));
};

