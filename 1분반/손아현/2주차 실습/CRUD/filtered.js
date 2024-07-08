var fs = require('fs');
fs.readFile('Sample.txt', 'utf8', function(err, data){
  console.log(data);
});
