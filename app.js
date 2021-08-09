const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

//API WORKS:


//FOR ALL GET,POST,DELETE:
app.route("/articles")
    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })
    .post(function (req, res) {

        //mongoose insert
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully added");
            } else {
                res.send(err);
            }
        });
    })
    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Sucessfully deleted");
            } else {
                res.send(err);
            }
        });
    });





//SPECIFIC GET,POST,DELETE:
app.route("/articles/:articleTitle")

.get(function(req, res){
     Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
         if(foundArticle){
             res.send(foundArticle);
         }else{
             res.send("No article found");
         }
     });
})
//update ar time onno data/field na dile delete kore dei
.put(function(req, res){
    Article.update(
        {title: req.params.articleTitle},//search for the specific title(URL)
        {title: req.body.title, content: req.body.content},//change..put the data
        {overwrite: true},
        function(err){
            if(!err){
                res.send("Successfully Updated");
            }
        }
    );
})
//those who have new value...keep other value..onno kisu delete krbe nh
.patch(function(req, res){
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully updated");
            }else{
                res.send(err);
            }
        }
    );
})
.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Successfully deleted the specific data");
            }else{
                res.send(err);
            }
        }
    );
});


app.listen(3000, function () {
    console.log("Server started on port 3000");
});