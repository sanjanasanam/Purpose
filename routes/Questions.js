var express = require("express");
var router = express.Router();
var middlewareObj = require('../middleware/index.js');

//Requiring the model
var Question = require("../models/question.js");

//Landing page
router.get("/",function(req,res){
    res.render("../views/Responsive Restraurant/index");
})

//1.index- Index page
router.get("/questions",function(req,res){
    Question.find({},function(err,questions){
        if(err){
            console.log("SOMETHING WENT WRONG!!");
        }
        else{
            console.log(req.user);
            res.render("../views/Questions/home",{questions : questions});
        }
    })
})
//2.new- renders form to create a new blog
router.get("/questions/new",middlewareObj.isLoggedIn,function(req,res){
    res.render("../views/Questions/new");
})
//3.create- Takes data from the new form and creates a new blog
router.post("/questions",middlewareObj.isLoggedIn,function(req,res){
    req.body.description = req.sanitize(req.body.description);
    Question.create({
        author : {id : req.user._id, username : req.user.username},
        description : req.body.description
    },function(err,blog){
        if(err)
            console.log("SOMETHING WENT WRONG!!!");
        else{
            console.log("New Question has Been added Successfully");
            console.log(blog);
            res.redirect("/questions");
        }
    })
})
// //4.show- renders show page of a particular blog
router.get("/questions/:id",function(req,res){
    Question.findById(req.params.id).populate("answers").exec(function(err,post){
        console.log(post);
        if(err){
            console.log("SOMETHING WENT WRONG!!");
        }
        else{
            res.render("../views/Questions/show",{post : post});
        }
    })
}) 
//5.edit- renders edit form for the particular blog
router.get("/questions/:id/edit",middlewareObj.checkQuestionOwnership,function(req,res){
    Question.findById(req.params.id,function(err,question){
        if(err){
            console.log(err);
            res.send("OOPS could not the find the page");
        }
        else{
            console.log(question.description);
            res.render("../views/Questions/edit.ejs",{question:question})
        }
    })
})
//6.update - updating the blog from the information we got from edit form
router.put("/questions/:id",middlewareObj.checkQuestionOwnership,function(req,res){
    req.body.description = req.sanitize(req.body.description);
    Question.findByIdAndUpdate(req.params.id,req.body,function(err,post){
        if(err){
            console.log(err);
            res.redirect("/questions");
        }
        else{
            console.log(post);
            req.flash("success","Question has been successfully updated!")
            res.redirect("/questions");
        }
    })
})
// //7.destroy - deletes the post from the database
router.delete("/questions/:id",middlewareObj.checkQuestionOwnership,function(req,res){
    console.log("put hello");
    Question.findByIdAndRemove(req.params.id,function(err,post){
        if(err){
            console.log(err);
            res.redirect("/questions");
        }
        else{
            console.log("A question has been removed successfully");
            req.flash("success","Question has been successfully deleted!")
            res.redirect("/questions");
        }
    })
})


//for filters
router.get("/questions/filter/:filter",function(req,res){
    Question.find({},function(err,questions){
        if(err){
            console.log("SOMETHING WENT WRONG!!");
        }
        else{
            console.log(req.user);
            res.render("../views/Questions/filtered",{questions : questions, filter : req.params.filter});
        }
    })
})
router.post("/questions/filter",function(req,res){
    var filter = req.body.filter;
    res.redirect("/questions/filter/" + filter);
})

// for contact
router.get("/contact",function(req,res){
    res.render("../views/Responsive Restraurant/contact");
})

module.exports = router;