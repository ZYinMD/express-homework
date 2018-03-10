const fs = require('fs');
const path = require('path');
var data = require('../data/friends.json'); //get data out of the json file as database
module.exports = function(app) {
  app.get('/api/friends', (req, res) => res.json(data));
  app.post('/api/friends', (req, res) => {
    res.json(match(req.body, data)); //the best match is returned to the POST request
    data.push(req.body); //add the new person into database
    fs.writeFile('./app/data/friends.json', JSON.stringify(data), (err) => { //write the updated database into file
      if (err) console.log('Failed in writing database: ', err);
    });
  });
};

function match(newPerson, peopleList) { //this function compare the new person and returns a matched person
  var match = peopleList[0];
  for (let i of peopleList) {
    if (diff(i, newPerson) < diff(match, newPerson)) match = i;
  }
  return match;
}

function diff(person1, person2) { //this function evaluates how different two persons are. Difference is measured by adding the difference of each question.
  var totalDiff = 0;
  for (let i in person1.scores) {
    totalDiff += Math.abs(person1.scores[i] - person2.scores[i]);
  }
  return totalDiff;
}
