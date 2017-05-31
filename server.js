const express = require('express');
const mongoose = require('mongoose');
const app = express();
mongoose.Promise = global.Promise;


const {PORT, DATABASE_URL} = require('./config');
const {post} = require('./models');

app.get('/blog-posts', (req, res) => {
	post
	.find()
	.exec()
	.then(posts => {
		res.json(posts.map(post => post.apiRepr()));
	})
	.catch(err => {
		console.error(err);
		res.status(500).json({message: 'Internal server error'});
	});
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

