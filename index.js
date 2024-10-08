const express = require("express");
const app = express();
const router = express.Router();
var fs = require('fs');
var bodyParser = require('body-parser');
var urlencodepasser = bodyParser.urlencoded({extends: false})


app.use(express.static('public'));
/*
- Create new html file name home.html 
- add <h1> tag with message "Welcome to ExpressJs Tutorial"
- Return home.html page to client
*/
// http://127.0.0.1:8081/home
router.get('/home', (req,res) => {
  res.sendFile(__dirname + "/" + "home.html");
});

/*
- Return all details from user.json file to client as JSON format
*/
// http://127.0.0.1:8081/profile
router.get('/profile', (req,res) => {
  fs.readFile('user.json','utf8',(err,data) => {
    res.send(JSON.parse(data))
  })
});

/*
- Modify /login router to accept username and password as JSON body parameter
- Read data from user.json file
- If username and  passsword is valid then send resonse as below 
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid then send response as below 
    {
        status: false,
        message: "User Name is invalid"
    }
- If passsword is invalid then send response as below 
    {
        status: false,
        message: "Password is invalid"
    }
*/
//http://127.0.0.1:8081/login
router.post('/login', urlencodepasser, function (req,res)  {
  
  fs.readFile('user.json','utf8',(err,data) => {
   
    const username = req.body.user_name
    const password = req.body.password
    const readData = JSON.parse(data);
    if(readData.username == username){
      if(readData.password == password){
        res.json({ status: true, message: 'User is valid' });
      } else {
        res.json({ status: false, message: 'Password is invalid' });
      }
    } else {
      res.json({ status: false, message: 'User Name is invalid' });
    }
  })
});

/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logout.<b>
*/
//http://127.0.0.1:8081/logout/bert
router.get('/logout/:username', (req,res) => {
  const username = req.params.username;
  res.send(`<b>${username} successfully logged out.</b>`);
});

router.get('/error', (req, res, next) => {
  const err = new Error('Test error'); 
  next(err); 
});

/*
Add error handling middleware to handle below error
- Return 500 page with message "Server Error"
*/
app.use((err,req,res,next) => {
  console.error(err);
  res.status(500).send('Server Error');  
});

app.use('/', router);

app.listen(process.env.port || 8081);

console.log('Web Server is listening at port '+ (process.env.port || 8081));