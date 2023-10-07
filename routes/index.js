var express = require('express');
var bcrypt = require('bcrypt');

var router = express.Router();
var User = require('../models/user');

router.get('/', function (req, res, next) {
	return res.render('index.ejs');
});


router.post('/', function(req, res, next) {
    console.log(req.body);
    var personInfo = req.body;

    if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf) {
        res.send();
    } else {
        if (personInfo.password == personInfo.passwordConf) {
            // Hash and salt the password
            bcrypt.hash(personInfo.password, 10, function(err, hashedPassword) {
                if (err) {
                    console.log(err);
                    return next(err);
                }

                // Store the hashed password in the database
                User.findOne({ email: personInfo.email }, function(err, data) {
                    if (!data) {
                        var c;
                        User.findOne({}, function(err, data) {
                            if (data) {
                                console.log("if");
                                c = data.unique_id + 1;
                            } else {
                                c = 1;
                            }

                            var newPerson = new User({
                                unique_id: c,
                                email: personInfo.email,
                                username: personInfo.username,
                                password: hashedPassword, // Store the hashed password
                                passwordConf: personInfo.passwordConf
                            });

                            newPerson.save(function(err, Person) {
                                if (err)
                                    console.log(err);
                                else
                                    console.log('Success');
                            });

                        }).sort({ _id: -1 }).limit(1);
                        res.send({ "Success": "You are registered, you can login now." });
                    } else {
                        res.send({ "Success": "Email is already used." });
                    }
                });
            });
        } else {
            res.send({ "Success": "Password is not matched" });
        }
    }
});

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/login', function(req, res, next) {
    User.findOne({ email: req.body.email }, function(err, data) {
        if (data) {
            bcrypt.compare(req.body.password, data.password, function(err, result) {
                if (result === true) {
                    req.session.userId = data.unique_id;
                    res.send({ "Success": "Success!" });
                } else {
                    res.send({ "Success": "Wrong password!" });
                }
            });
        } else {
            res.send({ "Success": "This Email Is not registered!" });
        }
    });
});

router.get('/profile', function (req, res, next) {
	console.log("profile");
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('user.ejs', {"name":data.username,"email":data.email});
		}
	});
});

router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});

router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"This Email Is not regestered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});
	
});

router.get('/chat', function (req, res, next) {
	res.render("chat.ejs");
});

(() => {
	const connections = [];
	
	router.ws('/chat', function (ws, req) {
		
		// store connection for further use
		connections.push(ws);
		// store index of connection for later removal
		ws.connection_index = connections.length - 1;
		
		ws.on('message', async function (msg) {
			console.log('new message:', msg);
			// send message to all connected users
			for(let i of connections){
				i.send(msg);
			}
		});
		
		// remove the connection from the array when it closes
		ws.on('close', function() {
			connections.splice(ws.connection_index, 1);
		});
	});
})();

module.exports = router;