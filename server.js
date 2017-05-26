const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const jsonParser = bodyParser.json();

mongoose.Promise = global.Promise;
const {PORT, DATABASE_URL} = require('./config');
const {post} = require('./models');

const app = express();
app.use(bodyParser.json());

app.get('/blog-posts', (req, res) => {
	post
	.find()
	.then(blog-api-yulia => {
		res.json({
			blog-api-yulia: blog-api-yulia.map(
				(post) => post.apiRepr())
		});
	})
	.catch(
		err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'});
		});
});

app.get('/blog-posts/:id', (req, res) => {
	post
	.findById(req.params.id)
	.exec()
	.then(post => res.json(post.apiRepr()))
	.catch(err => {
		console.error(err);
		res.satus(500).json({message: 'Internal server error'})
	});
});

app.post('/blog-posts', (req, res) => {

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
		author: req.body.author})
	.then(
		post => res.status(201).json(post.apiRepr()))
	.cath(err => {
		console.error(err);
		res.status(500).json({message: 'Internal server error'});
	});
});

app.put('/blog-posts/:id', jsonParser (req, res) => {
	if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		const message = (
			'Request path id (${req.params.id}) and request body id ' + 
			'(${req.body.id}) must match');
		console.error(message);
		res.status(400).json({message:message});
	}

	const toUpdate = {};
	const updatableFields = ['title', 'content', 'author'];

	updatableFields.forEach(field => {
		if (field in req.body) {
			toUpdate[field] = req.body[field];
		}
	});

	post
		.findByIdAndUpdate(req.params.id, {$set: toUpdate})
		.exec()
		.then(post => res.status(201).end())
		.catch(err => res.status(400).json({message: 'Check if entered ID is correct'}));
});

app.delete('/blog-posts/:id', (req, res) => {
	post
	.findByIdAndRemove(req.params.id)
	.exec()
	.then(post => res.status(204).end())
	.cathch(err => res.status(500).json({message: 'Internal server error'}));
});

app.use ('*', function (req, res) => {
	res.status(404).json({message: 'Not Found'});
});


let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
     mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }

      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  };
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

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};