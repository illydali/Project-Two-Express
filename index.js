const express = require('express');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const MongoUtil = require('./MongoUtil');

const app = express();
app.use(express.json());
app.use(cors());

const COLLECTION_ARTICLES = "beautyhacks"


async function main() {
    await MongoUtil.connect(process.env.MONGO_URI, "test_homemade");

    // GET - welcome message
    app.get('/welcome', function (req, res) {
        res.json({
            'message': 'Welcome to my beauty hack !'
        })
    })

    // GET - view all articles in collection (checked)
    // tested on API

    app.get('/articles', async function (req, res) {
        try {
            const db = MongoUtil.getDB()

            let allArticles = await db.collection(COLLECTION_ARTICLES).find().toArray();
            res.json({
                'article': allArticles
            })
        } catch (e) {
            res.status(500);
            res.json({
                'message': "We are having technical issues, please be patient with us"
            })
            console.log(e);
        }

    })

    // GET - search filter using criteria honey & face (checked)
    // route as follows: /articles/search?title=honey&body_tags=face

    // tested on API

    app.get('/articles/search', async function (req, res) {
        try {

            // create citeria object (assumption: the user wants everything)
            let criteria = {};

            // query equals everything after ? --- example: ?title=honey&body_tags=face

            // search for all titles where the field has the word "honey" using regex
            if (req.query.title) {
                criteria['title'] = {
                    '$regex': req.query.title, // whatever is in search box
                    '$options': 'i' // means ignore casing
                }
            }


            // finding in an array
            if (req.query.body_tags) {
                criteria['body_tags'] = {
                    '$in': [req.query.body_tags]
                }
            }

            const db = MongoUtil.getDB();
            // when using .find() needs a toArray()
            // when using .findOne(), not required
            let allArticles = await db.collection(COLLECTION_ARTICLES).find(criteria).toArray();
            res.json({
                'article': allArticles
            })
        } catch (e) {
            res.status(500);
            res.json({
                'message': "There may be a problem with your system. Please contact tech support."
            })
            console.log(e);
        }

    })

    // POST - user can add new article
    // tested on API

    app.post('/article', async function (req, res) {

        try {

            let title = req.body.title;
            let image = req.body.image;
            let date = new Date(req.body.date); // format has to be "2022-03-06"
            let body_tags = req.body.body_tags.split(","); // tags shld be inserted as string separated by comma
            let ingredients = req.body.ingredients;
            let difficulty = req.body.difficulty;
            let duration = req.body.duration;
            let instructions = req.body.instructions
            let skin_concern = req.body.skin_concern

            // insert into mongo database
            const db = MongoUtil.getDB();

            await db.collection(COLLECTION_ARTICLES).insertOne({

                // if identical can just use a single variable name
                'title': title,
                'image': image,
                'date': date,
                'body_tags': body_tags,
                'ingredients': ingredients,
                'difficulty': difficulty,
                'duration': duration,
                'instructions': instructions,
                'skin_concern': skin_concern,

            });
            res.status(200);
            res.json({
                'message': 'Thank you for your submission!'
            })
        } catch (e) {
            res.status(500);
            res.json({
                'message': "Internal server error. Please contact administrator"
            })
            console.log(e);
        }
    })

    // PUT - user update a document aka edit (checked)
    // note : similar method to creating a new article but using app.put & updateOne

    // tested on API : update title 
    // TBC what else user is gonna be allowed to update
    app.put('/article/:id', async (req, res) => {

        try {
            let title = req.body.title;
            // let image = req.body.image;
            // let date = new Date(req.body.date)
            // let body_tags = req.body.body_tags
            // let ingredients = req.body.ingredients;
            // let difficulty = req.body.difficulty;
            // let duration = req.body.duration;
            // let instructions = req.body.instructions
            // let skin_concern = req.body.skin_concern

            // body_tags = body_tags.split(",")
            // date = new Date(date);

            let results = await MongoUtil.getDB().collection(COLLECTION_ARTICLES).updateOne({
                '_id': ObjectId(req.params.id)
            }, {
                '$set': {
                    'title': title,
                    // 'image': image,
                    // 'date': date,
                    // 'body_tags': body_tags,
                    // 'ingredients': ingredients,
                    // 'difficulty': difficulty,
                    // 'duration': duration,
                    // 'instructions': instructions,
                    // 'skin_concern': skin_concern,
                }
            });
            res.status(200);
            res.json({
                'message': 'Success'
            })
        } catch (e) {
            res.status(500);
            res.json({
                'message': "Please come back later"
            })
            console.log(e) // to check the actual error message
        }
    })

    // DELETE - user delete an article (checked) 
    // --- TBC --- if allowing user to delete an article
    // tested on API 
    app.delete('/article/:id', async function (req, res) {
        try {
            await MongoUtil.getDB().collection(COLLECTION_ARTICLES).deleteOne({
                '_id': ObjectId(req.params.id)
            })
            res.status(200);
            res.json({
                'message': 'Document has been deleted'
            })
        } catch (e) {
            res.status(500);
            res.json({
                'message': "Unable to delete documents"
            })
            console.log(e) // to check the actual error message
        }

    })

    // GET - COMMENTS 
    // show all user comments for one article (checked)
    // tested on API

    app.get('/article/:id/comments', async (req, res) => {

        try {
            let db = MongoUtil.getDB();
            let results = await db.collection(COLLECTION_ARTICLES).find({
                "_id": ObjectId(req.params.id)
            }).project({
                'comments': 1
            }).toArray()

            res.statusCode = 200
            res.send(results)

        } catch (e) {
            res.statusCode = 500
            res.send({
                "Message": "Unable to get comments"
            })
        }
    })

    // POST - COMMENTS 
    // user add in new comment (checked)
    // tested on API

    app.post('/article/:id/comments/create', async (req, res) => {
        try {
            let db = MongoUtil.getDB()

            let {
                username,
                email,
                text,
            } = req.body

            let results = await db.collection(COLLECTION_ARTICLES).updateOne({
                '_id': ObjectId(req.params.id)
            }, {
                '$push': {
                    'comments': {
                        username,
                        email,
                        text,
                        comment_date: new Date(),
                    }
                }
            })
            res.statusCode = 200
            res.send(results)

        } catch (e) {
            res.statusCode = 500
            res.send({
                "Message": "Unable to insert comment"
            });
            console.log(e)
        }

    })

    // PUT - COMMENTS 
    // user can edit comment
    // tested on API

    app.put('/article/:id/comments/edit/:username', async (req, res) => {

        try {
            let db = MongoUtil.getDB()

            let {
                text,
            } = req.body

            let results = await db.collection(COLLECTION_ARTICLES).updateOne({
                'comments': {
                    '$elemMatch': {
                        'username': req.params.username
                    }
                }
            }, {
                '$set': {
                    'comments.$.text': text,
                    'comments.$.comment_date': new Date(),
                }
            })

            res.statusCode = 200
            res.send({
                'message': 'Comments Updated'
            })

        } catch (e) {

            res.statusCode = 500
            res.send({
                "Message": "Unable to update comment"
            });
            console.log(e)
        }
    })

    // DELETE - COMMENTS
    // user can choose to delete a comment
    // tested on API

    app.delete('/article/:id/comments/:username', async (req, res) => {
        try {
            let db = MongoUtil.getDB();

            // find article that has the comment to be deleted
            let toDelete = await db.collection(COLLECTION_ARTICLES).findOne({
                '_id': ObjectId(req.params.id),
            })

            if (toDelete) {
                let clone = []
                if (toDelete.comments.length > 1) {
                    let oldComment = toDelete.comments;
                    let indexToDelete = oldComment.findIndex((c) => {
                        return c.username == req.params.username;
                    });

                    clone = [
                        ...oldComment.slice(0, indexToDelete),
                        ...oldComment.slice(indexToDelete + 1)
                    ];
                }

                let results = await db.collection(COLLECTION_ARTICLES).updateOne({
                    '_id': ObjectId(req.params.id)
                }, {
                    $set: {
                        "comments": clone
                    }
                })

                res.statusCode = 200
                res.send(results)
            }
        } catch (e) {
            res.statusCode = 500
            res.send({
                "Message": "Unable to delete comment"
            })
        }
    })
}

main();

app.listen(process.env.PORT || 3000, () => {
    console.log("Server has started")
})
