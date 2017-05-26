const express = require('express');
const app = express();

app.get('/blog-post', (req, res) => {
	res.sendStatus(200) // most simple response (Everything OK)
})

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});