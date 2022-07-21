const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  const homePage = __dirname + '/signup.html';
  res.sendFile(homePage);
});

app.post('/', (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const failure = __dirname + '/failure.html';
  const success = __dirname + '/success.html';

  const jsonData = JSON.stringify(data);

  const url = `https://us18.api.mailchimp.com/3.0/lists/5b084de2da`;
  const options = {
    method: 'POST',
    auth: 'enigma:675009a0c7d6af849da388113e545b36-us18',
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode == 200) {
      res.sendFile(success);
    } else {
      res.sendFile(failure);
    }
    response.on('data', function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post('/failure', (req, res) => {
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

// API Key
// 675009a0c7d6af849da388113e545b36-us18

// LIST Id
// 5b084de2da
