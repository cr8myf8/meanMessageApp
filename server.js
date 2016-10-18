var express = require('express');
var app = express();
var bodyParser = require('body-parser')
const request = require('request')

//setup email
var nodemailer = require('nodemailer')
let EMAIL_ACCOUNT_USER = "postmanmessenger@gmail.com";
let EMAIL_ACCOUNT_PASSWORD = "fheTextMessage";
let YOUR_NAME = "Message Master";

let smtpTransport = nodemailer.createTransport("SMTP",{
  service: "Gmail",  // sets automatically host, port and connection security settings
  auth: {
    user: EMAIL_ACCOUNT_USER,
    pass: EMAIL_ACCOUNT_PASSWORD
  }
});

//setup text message
const twilio = require('twilio');
const client = new twilio.RestClient('ACf0428cd03e481d5dcb8c38869a53cbf0','9279c4b5012366d5732a7336a76fa366');

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json())

app.post('/sendText',function(req,res){
	var num = req.body.num;

	console.log(req.body.num);
	console.log(req.body.message);

	client.sms.messages.create({
	    to:req.body.num,
	    from:'(801) 416-3669',
	    body: req.body.message
	}, function(error, message) {
	    // The HTTP request to Twilio will run asynchronously. This callback
	    // function will be called when a response is received from Twilio
	    // The "error" variable will contain error information, if any.
	    // If the request was successful, this value will be "falsy"
	    if (!error) {
	        // The second argument to the callback will contain the information
	        // sent back by Twilio for the request. In this case, it is the
	        // information about the text messsage you just sent:
	        console.log('Success! The SID for this SMS message is:');
	        console.log(message.sid);
	        console.log('Message sent on:');
	        console.log(message.dateCreated);
	        console.log(num)
	        res.status(200).json(num);
	    } else {
	        console.log('Oops! There was an error.');
	        console.log(error)
	    }
	});

});

app.post('/sendEmail',function(req,res){
	console.log("sending email:"+req.body.toField)
	smtpTransport.sendMail({  //email options
        from: "Scott Owen <yodowen@gmail.com>", // sender address.  Must be the same as authenticated user if using GMail.
        to: req.body.toField, // receiver
        subject: req.body.subjectField, // subject
        text: req.body.textField // body
      }, function(error, response){  //callback
        if(error){
          console.log(error);
        }else{
          console.log("Message sent: " + response.message);
          res.send("email sent");
        }

        // smtpTransport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
      });
    

});

app.get('/sendEmail',function(req,res){
	smtpTransport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
	res.send("closed smtp Transport")
});

app.post('/getMap',function(req,res){
	console.log( encodeURI(req.body.address) )
	var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+encodeURI(req.body.address)+"&key=AIzaSyBnpfpDKkxLU0EHrRC5nSIWGiNmkgnseA8";

	console.log(url);
	/*request
  		.get(url)
  		.on('response', function(response) {
   			console.log(response.statusCode) // 200 
   			console.log(response.headers['content-type']) // 'image/png' 
   			res.send(response)
  		});
*/
  	request({
	    method: 'GET',
	    uri: url,
	    'content-type': 'application/json',
	  },
	  function (error, response, body) {
	    if (error) {
	      return console.error('upload failed:', error);
	    }
	    //console.log('Upload successful!  Server responded with:', body);
	    var obj = JSON.parse(body); 
	    res.send({ 'addr':obj['results'][0]['formatted_address'], 'coordinates':obj['results'][0]['geometry']['location']})
    })

	//res.send(url)
});


app.listen(3000,function(){
	console.log("i am listening on 3000");
});