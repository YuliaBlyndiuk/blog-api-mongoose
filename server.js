const express = require('express');
const mongoose = require('mongoose');
const app = express();
mongoose.Promise = global.Promise;
var bodyParser = require('body-parser');

const {PORT, DATABASE_URL} = require('./config');
const {post} = require('./models');

app.get('/posts', (req, res) => {
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

app.get('/posts/:id', (req, res) => {
	post
	.findById(req.params.id)
	.exec()
	.then(post => res.json(post.apiRepr()))
	.catch(err => {
		console.error(err);
		res.status(500).json({message: 'Internal server error'});
	});
});

app.post('/posts', bodyParser.json(), (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = 'Missing \'${field}\' in request body'
			console.error(message);
			return res.status(400).send(message);
		}
	}

	post
	.create({
		title: req.body.title,
      	content: req.body.content,
      	author: req.body.author
    })
    .then(post => res.status(201).json(post.apiRepr()))
    .catch(err => {
    	console.error(err);
    	res.status(500).json({message: 'Internal server error'});
    });
});

app.put('/posts/:id', bodyParser.json(), (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		res.status(400).json({error: 'request ID and request body id must match'});
	}

	const updated = {};
	const fieldsToUpd = ['title', 'content', 'author'];
	fieldsToUpd.forEach(field => {
		if (field in req.body) {
			updated[field] = req.body[field];
		}
	});

	post
	.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
	.exec()
	.then(updatedPost => res.status(201).json(updatedPost.apiRepr()))
	.catch(err => res.status(500).json({message: 'Internal server error'}));
});

app.delete('/posts/:id', (req, res) => {
	post
	.findByIdAndRemove(req.params.id)
	.exec()
	.then(() => {	
		res.sendStatus(204);
	})
	.catch(err => {
		console.error(err);
		res.status(500).json({errir: 'Internal server error'});
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

