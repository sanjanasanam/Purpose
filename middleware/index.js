var Question = require('../models/question.js');
var Answer = require("../models/answer");

var middlewareObj = {};

middlewareObj.checkQuestionOwnership = function checkQuestionOwnership(req,res,next){
    if(req.isAuthenticated()){
        Question.findById(req.params.id,function(err,question){
            if(err){
                res.redirect("back");
            }
            else{
                if(question.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error","You are not allowed to do that!")
                    res.redirect("back")
                }
            }
        })
    }
    else{
        req.flash("error","You have to be logged in to do that!")
        res.redirect("/login")
    }
}

//Checking weather the user owns the Comment
middlewareObj.checkAnswerOwnership = function(req, res, next) {
    //Is the user logged in	
    if(req.isAuthenticated()){
           //Finding the comment by id
           Answer.findById(req.params.answer_id, function(err, answer){
              if(err){
                  res.redirect("back");
              }  else {
                   //If found ,are author and user same
                   if(answer.author.id.equals(req.user._id)|| (req.user.isAdmin)) {
                       next();
                   } else {
                       req.flash("error", "You don't have permission to do that");
                       res.redirect("back");
                   }
              }
           });
       } else {
           req.flash("error", "You need to be logged in to do that");
           res.redirect("back");
       }
   }

middlewareObj.isLoggedIn = function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        next();
    }
    else{
        req.flash("error","You have to be logged in to do that!")
        res.redirect("/login")
    }
}

module.exports = middlewareObj;