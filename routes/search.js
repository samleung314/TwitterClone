var express = require('express');
var router = express.Router();

var User = require('../models/UserRemote');
var Item = require('../models/Item');

router.post('/', function (req, res, next) {
  // default values
  var now = Math.floor(Date.now() / 1000);
  var time = now;
  var limit = 25;
  var q = '';
  var username = '';
  var following = true;
  var rank = '';
  var parent = '';
  var replies = true;
  var hasMedia = false;

  var currentUser = req.cookies.username;

  var error = false;
  if (typeof (req.body.timestamp) !== 'undefined') time = req.body.timestamp;
  if (typeof (req.body.limit) !== 'undefined') limit = Number(req.body.limit);
  if (typeof (req.body.q) !== 'undefined') q = req.body.q;
  if (typeof (req.body.username) !== 'undefined') username = req.body.username;
  if (typeof (req.body.following) !== 'undefined') following = req.body.following;
  if (time > now || limit > 100 || limit < 0) error = true;
  if (typeof (req.body.replies) !== 'undefined') replies = req.body.replies;
  if (typeof (req.body.hasMedia) !== 'undefined') hasMedia = req.body.hasMedia;

  console.log(req.body);
  console.log('limit: ' + limit);
  console.log('q: ' + q);
  console.log('username: ' + username);
  console.log("TYPEOF following: " + typeof(req.body.following) + ' value: ' + following);
  if(following == 'false') following = false;
  if(following == true) console.log(following + " is true");
  if(following == false) console.log(following + " is false");

  if (error) {
    console.log("invalid search");
    res.status(200).json({
      status: 'error',
      error: "Invalid search params"
    });
  }

  function returnUserPosts_Main(user) {
    if(parent) {
      //valid item?
      Item.findOne({ id: parent}, function(err, item) {
        //can't find item
        if (err || !item) {
          console.log("Can't find item");
          res.status(200).json({
          status: 'OK',
          items: {}
        });
        return;
        }
        else {
          if(reply && hasMedia) {
            returnUserPosts_Pa_MeO(user);
          }
          else if(reply && !hasMedia) {
            returnUserPosts_Pa(user);
          }
          else if(!reply && hasMedia) {
            returnUserPosts_Pa_NoRe_MeO(user);
          }
          else if(!reply && !hasMedia){
            returnUserPosts_Pa_NoRe(user);
          }
        }
      });
    }
    //parent not given
    else{
      if(reply && hasMedia) {
        returnUserPosts_MeO(user);
      }
      else if(reply && !hasMedia) {
        returnUserPosts(user);
      }
      else if(!reply && hasMedia) {
        returnUserPosts_NoRe_MeO(user);
      }
      else if(!reply && !hasMedia){
        returnUserPosts_NoRe(user);
      }
    }

  }

  function returnFollowingPosts_Main() {
    if(parent) {
      //valid item?
      Item.findOne({ id: parent}, function(err, item) {
        //can't find item
        if (err || !item) {
          console.log("Can't find item");
          res.status(200).json({
          status: 'OK',
          items: {}
        });
        return;
        }
        else {
          if(reply && hasMedia) {
            return  returnFollowingPosts_Pa_MeO();
          }
          else if(reply && !hasMedia) {
            returnFollowingPosts_Pa();
          }
          else if(!reply && hasMedia) {
            returnFollowingPosts_Pa_NoRe_MeO();
          }
          else if(!reply && !hasMedia){
            returnFollowingPosts_Pa_NoRe();
          }
        }
      });
    }
    //parent not given
    else{
      if(reply && hasMedia) {
        returnFollowingPosts_MeO();
      }
      else if(reply && !hasMedia) {
        returnFollowingPosts();
      }
      else if(!reply && hasMedia) {
        returnFollowingPosts_NoRe_MeO();
      }
      else if(!reply && !hasMedia){
        returnFollowingPosts_NoRe();
      }
    }
  }

  function returnAllPosts_Main() {
    if(parent) {
      //valid item?
      Item.findOne({ id: parent}, function(err, item) {
        //can't find item
        if (err || !item) {
          console.log("Can't find item");
          res.status(200).json({
          status: 'OK',
          items: {}
        });
        return;
        }
        else {
          if(reply && hasMedia) {
            returnAllPosts_Pa_MeO();
          }
          else if(reply && !hasMedia) {
            returnAllPosts_Pa();
          }
          else if(!reply && hasMedia) {
            returnAllPosts_Pa_NoRe_MeO();
          }
          else if(!reply && !hasMedia){
            returnAllPosts_Pa_NoRe();
          }
        }
      });
    }
    //parent not given
    else{
      if(reply && hasMedia) {
        returnAllPosts_MeO();
      }
      else if(reply && !hasMedia) {
        returnAllPosts();
      }
      else if(!reply && hasMedia) {
        returnAllPosts_NoRe_MeO();
      }
      else if(!reply && !hasMedia){
        returnAllPosts_NoRe();
      }
    }
  }

  //user given
  if (username) {
    console.log("username:" + username)
    //valid user?
    UserRemote.findOne({ username: username }, function levelOne(err, user) {
      //can't find user
      if (err || !user) {
        console.log("Can't find username");
        res.status(200).json({
          status: 'OK',
          items: {}
        });
        return;
        //found user
      } else {
        console.log("found user: " + user.username);
        //following
        if (following) {
          //check logged in user is following username
          if (user.followers.indexOf(currentUser) >= 0) {
            console.log('returnUserPosts()')
            returnUserPosts(user);
          } else {
            console.log("Target user is not being followed");
            res.status(200).json({
              status: 'OK',
              items: {}
            });
            return;
          }

          //not following
        } else {
          returnUserPosts(user);
        }
      }
    });
    //user not given
  } else {
    if (following) {
      console.log("returnFollowingPosts()")
      returnFollowingPosts();
    } else {
      console.log("returnAllPosts()")
      returnAllPosts();
    }
  }
});

//HELPER METHODS FOR RETURNING USER POSTS

//no parent, media only
function returnUserPosts_MeO(user) {
  Item.
      find({
        timestamp: { $lte: time },
        username: user.username,
        content: { $regex: q, $options: "i" },
        "media.0": { "$exists": true }
      }, {
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN USER POSTS");
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });
}

//no parent 
function returnUserPosts(user) {
  Item.
      find({
        timestamp: { $lte: time },
        username: user.username,
        content: { $regex: q, $options: "i" },
      }, {
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN USER POSTS");
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });
}

//no parent, exclude replies, media only
function returnUserPosts_NoRe_MeO(user) {
  Item.
      find({
        timestamp: { $lte: time },
        username: user.username,
        content: { $regex: q, $options: "i" },
        $or: [{childType: null},{childType: 'retweet'}],
        "media.0": { "$exists": true }
      }, {
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN USER POSTS");
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });
}

//no parent, exclude replies
function returnUserPosts_NoRe(user) {
  Item.
      find({
        timestamp: { $lte: time },
        username: user.username,
        content: { $regex: q, $options: "i" },
        $or: [{childType: null},{childType: 'retweet'}]
      }, {
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN USER POSTS");
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });

}

//------------------------------------------

//with parent, media only
function returnUserPosts_Pa_MeO(user) {
  Item.
      find({
        timestamp: { $lte: time },
        username: user.username,
        content: { $regex: q, $options: "i" },
        parent: parent,
        "media.0": { "$exists": true }
      }, {
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN USER POSTS");
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });
}

//with parent
function returnUserPosts_Pa(user) {
  Item.
      find({
        timestamp: { $lte: time },
        username: user.username,
        content: { $regex: q, $options: "i" },
        parent: parent
      }, {
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN USER POSTS");
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });
}

//with parent, exclude replies, media only
function returnUserPosts_Pa_NoRe_MeO(user) {
  Item.
      find({
        timestamp: { $lte: time },
        username: user.username,
        content: { $regex: q, $options: "i" },
        parent: parent,
        $or: [{childType: null},{childType: 'retweet'}],
        "media.0": { "$exists": true }
      }, {
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN USER POSTS");
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });
}

//with parent, exclude replies
function returnUserPosts_Pa_NoRe(user) {
  Item.
      find({
        timestamp: { $lte: time },
        username: user.username,
        content: { $regex: q, $options: "i" },
        parent: parent,
        $or: [{childType: null},{childType: 'retweet'}]
      }, {
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN USER POSTS");
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });
}


//HELPER METHODS FOR RETURNIG 'FOLLOWING' POSTS

//no parent, media only
function returnFollowingPosts_MeO() {
  UserRemote.findOne({ username: currentUser }, function (err, user) {
    Item.
      find({
        username: { $in: user.following },
        timestamp: { $lte: time },
        content: { $regex: q, $options: "i" },
        "media.0": { "$exists": true }
      },{
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN FOLLOWING POSTS");
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });
  });
}

//no parent 
function returnFollowingPosts() {
  UserRemote.findOne({ username: currentUser }, function (err, user) {
    Item.
      find({
        username: { $in: user.following },
        timestamp: { $lte: time },
        content: { $regex: q, $options: "i" }
      },{
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN FOLLOWING POSTS");
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });
  });
}

//no parent, exclude replies, media only
function returnFollowingPosts_NoRe_MeO() {
  UserRemote.findOne({ username: currentUser }, function (err, user) {
    Item.
      find({
        username: { $in: user.following },
        timestamp: { $lte: time },
        content: { $regex: q, $options: "i" },
        $or: [{childType: null},{childType: 'retweet'}],
        "media.0": { "$exists": true }
      },{
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN FOLLOWING POSTS");
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });
  });
}

//no parent, exlude replies
function returnFollowingPosts_NoRe() {
  UserRemote.findOne({ username: currentUser }, function (err, user) {
    Item.
      find({
        username: { $in: user.following },
        timestamp: { $lte: time },
        content: { $regex: q, $options: "i" },
        $or: [{childType: null},{childType: 'retweet'}]
      },{
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN FOLLOWING POSTS");
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });
  });
}

//-----------------------------------------------

//with parent, media only
function returnFollowingPosts_Pa_MeO() {
  UserRemote.findOne({ username: currentUser }, function (err, user) {
    Item.
      find({
        username: { $in: user.following },
        timestamp: { $lte: time },
        content: { $regex: q, $options: "i" },
        parent: parent,
        "media.0": { "$exists": true }
      },{
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN FOLLOWING POSTS");
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });
  });
}

//with parent
function returnFollowingPosts_Pa() {
  UserRemote.findOne({ username: currentUser }, function (err, user) {
    Item.
      find({
        username: { $in: user.following },
        timestamp: { $lte: time },
        content: { $regex: q, $options: "i" },
        parent: parent
      },{
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN FOLLOWING POSTS");
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });
  });
}

//with parent, exclude replies, media only
function returnFollowingPosts_Pa_NoRe_MeO() {
  UserRemote.findOne({ username: currentUser }, function (err, user) {
    Item.
      find({
        username: { $in: user.following },
        timestamp: { $lte: time },
        content: { $regex: q, $options: "i" },
        parent: parent,
        $or: [{childType: null},{childType: 'retweet'}],
        "media.0": { "$exists": true }
      },{
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN FOLLOWING POSTS");
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });
  });
}

//with parent, exclude replies
function returnFollowingPosts_Pa_NoRe() {
  UserRemote.findOne({ username: currentUser }, function (err, user) {
    Item.
      find({
        username: { $in: user.following },
        timestamp: { $lte: time },
        content: { $regex: q, $options: "i" },
        parent: parent,
        $or: [{childType: null},{childType: 'retweet'}]
      },{
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN FOLLOWING POSTS");
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });
  });
}


//HELPER METHODS FOR RETURNING ALL POSTS

//no parent, media only
function returnAllPosts_MeO() {
  Item.
      find({
        timestamp: { $lte: time },
        content: { $regex: q, $options: "i" },
        "media.0": { "$exists": true }
      },{
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN ALL POSTS");
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });
}

//no parent 
function returnAllPosts() {
  Item.
      find({
        timestamp: { $lte: time },
        content: { $regex: q, $options: "i" }
      },{
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN ALL POSTS");
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });
}

//no parent, exclude replies, media only
function returnAllPosts_NoRe_MeO() {
  Item.
      find({
        timestamp: { $lte: time },
        content: { $regex: q, $options: "i" },
        $or: [{childType: null},{childType: 'retweet'}],
        "media.0": { "$exists": true }
      },{
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN ALL POSTS");
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });
}

//no parent, exclude replies
function returnAllPosts_NoRe() {
  Item.
      find({
        timestamp: { $lte: time },
        content: { $regex: q, $options: "i" },
        $or: [{childType: null},{childType: 'retweet'}]
      },{
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN ALL POSTS");
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });
}

//--------------------------------------------

//with parent, media only
function returnAllPosts_Pa_MeO() {
  Item.
      find({
        timestamp: { $lte: time },
        content: { $regex: q, $options: "i" },
        parent: parent,
        "media.0": { "$exists": true }
      },{
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN ALL POSTS");
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });
}

//with parent
function returnAllPosts_Pa() {
  Item.
      find({
        timestamp: { $lte: time },
        content: { $regex: q, $options: "i" },
        parent: parent
      },{
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN ALL POSTS");
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });
}

//with parent, exclude replies, media only
function returnAllPosts_Pa_NoRe_MeO() {
  Item.
      find({
        timestamp: { $lte: time },
        content: { $regex: q, $options: "i" },
        parent: parent,
        $or: [{childType: null},{childType: 'retweet'}],
        "media.0": { "$exists": true }
      },{
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN ALL POSTS");
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });
}

//with parent, exclude replies
function returnAllPosts_Pa_NoRe() {
  Item.
      find({
        timestamp: { $lte: time },
        content: { $regex: q, $options: "i" },
        parent: parent,
        $or: [{childType: null},{childType: 'retweet'}]
      },{
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN ALL POSTS");
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });
}



module.exports = router;