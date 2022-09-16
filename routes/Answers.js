var express = require('express');
var router = express.Router();
var Question = require('../models/question');
var Answer    = require('../models/answer');
var middleware = require("../middleware");
//=========comment routes

// ========= RESTFUL ROUTES ==========

//1.Index - lies in campground show page

//2.new - renders form for creating new comment
router.get("/questions/:id/answer/new",middleware.isLoggedIn,function(req,res){
	Question.findById(req.params.id,function(err,question){
		res.render("./Answers/new",{question : question})
	})
})

// //3.create - Creating new comment from the details given by new form
router.post("/questions/:id/answer",function(req,res){
	Question.findById(req.params.id,function(err,question){
		if(err)
			console.log(err);
		else{
			Answer.create(req.body.comment,function(err,answer){
				if(err)
					console.log(err);
				else{
					answer.author.id = req.user._id;
					answer.author.username = req.user.username;
					answer.save();
					console.log(answer);
					question.answers.push(answer);
					question.save()
					console.log(question);
					res.redirect("/questions/"+question._id)
				}
			})
		}
	})
})

// //4.show - lies in the show page of the campground

//5.Edit - render an edit form to edit the comment
router.get("/questions/:id/answer/:answer_id/edit",middleware.checkAnswerOwnership,function(req,res){
	Answer.findById(req.params.answer_id,function(err,answer){
		res.render("./Answers/edit",{post_id : req.params.id , answer : answer})
	})
})

//6.Update - updates the comment from the details given by edit form
router.put("/questions/:id/answer/:answer_id",middleware.checkAnswerOwnership,function(req,res){
	Answer.findByIdAndUpdate(req.params.answer_id,req.body.comment,function(err,answer){
		if(err)
			res.redirect("back");
		else
			res.redirect("/questions/" + req.params.id);
	})
})

//7.Delete - deletes the comment
router.delete("/questions/:id/answer/:answer_id",middleware.checkAnswerOwnership,function(req,res){
	Answer.findByIdAndRemove(req.params.answer_id,function(err){
		if(err)
			res.redirect("back");
		else
			res.redirect("/questions/" + req.params.id);
	})
})


module.exports = router;