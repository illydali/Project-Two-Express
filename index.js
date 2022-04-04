const express = require('express');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const MongoUtil = require('./MongoUtil');

const app = express();
app.use(express.json());
app.use(cors());

const COLLECTION_ARTICLES = "beautyhacks"
const COLLECTION_INGREDIENTS = "ingredients"
const COLLECTION_SKIN = 'skin_concern'

async function main() {
    await MongoUtil.connect(process.env.MONGO_URI, "test_homemade");

    // GET - welcome message
    app.get('/welcome', function (req, res) {
        res.json({
            'message': 'Welcome to the Skin Lang. API!'
        })
    })

    app.get('/ingredients', async function (req, res) {
        try {
            const db = MongoUtil.getDB()

            let allIngredients = await db.collection(COLLECTION_INGREDIENTS).find().toArray();


            res.json({
                'ingredients': allIngredients
            })
        } catch (e) {
            res.status(500);
            res.json({
                'message': 'Confirm something wrong here'
            })
            console.log(e)
        }
    })

    // skin_concern collection here -- TBC if needed later
    app.get('/skin', async function (req, res) {
        try {
            const db = MongoUtil.getDB()

            let allTypes = await db.collection(COLLECTION_SKIN).find().toArray();


            res.json({
                'skin_types': allTypes
            })
        } catch (e) {
            res.status(500);
            res.json({
                'message': 'Confirm something wrong here'
            })
            console.log(e)
        }
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
            // console.log(e);
        }

    })

    // GET - by one id

    app.get('/article/:id', async function (req, res) {
        try {
            const db = MongoUtil.getDB()
            let result = await db.collection(COLLECTION_ARTICLES).find({
                '_id': ObjectId(req.params.id)
            }).toArray();

            res.status(200);
            res.send(result);
        } catch (e) {
            res.status(500);
            res.send({
                "message": "invalid"
            })
        }
    })

    // GET - search filter using criteria honey & face (checked)
    // route as follows: /articles/search?title=honey&body_tags=face

    // tested on API

    app.get('/articles/search', async function (req, res) {
        try {

            // create citeria object for title or description
            let criteria = {};

            // filter by duration and body tags
            // let filterCriteria = {};

            // query equals everything after ? --- example: ?title=honey&body_tags=face

            // search for all titles where the field has the word "honey" using regex
            if (req.query.title) {
                criteria['title'] = {
                    '$regex': req.query.title, // whatever is in search box
                    '$options': 'i' // means ignore casing
                }
            }

            if (req.query.description) {
                criteria['description'] = {
                    '$regex': req.query.description,
                    '$options': 'i'
                }
            }

            // finding in an array
            if (req.query.body_tags) {
                criteria['body_tags'] = {
                    '$in': [req.query.body_tags]
                }
            }

            // selecting by duration
            if (req.query.duration) {
                if (req.query.duration == '10mins or less') {
                    criteria['duration'] = {
                        '$lte': 10
                    }
                }
                if (req.query.duration == '10mins to 20mins') {
                    criteria['duration'] = {
                        '$lte': 20,
                        '$gte': 10
                    }
                }
                if (req.query.duration == '20mins and above') {
                    criteria['duration'] = {
                        '$gte': 20
                    }
                }
            }

            const db = MongoUtil.getDB();
            // when using .find() needs a toArray()
            // when using .findOne(), not required
            let results = await db.collection(COLLECTION_ARTICLES)
                .find(criteria).toArray();
            if (results.length == 0) {
                return (
                    res.status(300),
                    res.json({
                        'message': "No matches found"
                    })
                )
            }
            console.log(criteria)

            res.send(results)
            res.status(200)
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
            let email = req.body.email;
            let description = req.body.description;
            let body_tags = req.body.body_tags // tags shld be inserted as string separated by comma
            let ingredients = req.body.ingredients // need to split

            let duration = req.body.duration;
            let instructions = req.body.instructions
            let skin_concern = req.body.skin_concern

            // form validation

            let testInfo = 0;

            if (title.length < 4) {
                testInfo += 1;
            }
            console.log(title)
            if (!image) {
                testInfo += 1;
            }
            console.log(image)
            if (description.length < 5) {
                testInfo += 1;
            }
            if (!body_tags) {
                testInfo += 1;
            }
            if (!ingredients) {
                testInfo += 1;
            }
            console.log(ingredients)
            if (!duration) {
                testInfo += 1;
            }
            if (!instructions) {
                testInfo += 1;
            }
            console.log(instructions)
            if (!skin_concern) {
                testInfo += 1
            }
            console.log(testInfo)
            if (testInfo > 0) {
                return res.status(406).json({
                    'message': 'incomplete'
                })
            } else {
                body_tags = body_tags.split(",")
                // console.log(typeof body_tags)
                body_tags = body_tags.map(each => {
                    return each.trim()
                })
                instructions = instructions.split(",")
                instructions = instructions.map(each => {
                    return each.trim()
                })
                ingredients = ingredients.map((each) => {
                    return {
                        name: each.name || "",
                        quantity: each.quantity || ""
                    }
                })
            }
            // insert into mongo database
            const db = MongoUtil.getDB();

            await db.collection(COLLECTION_ARTICLES).insertOne({

                title,
                image,
                date: new Date(),
                description,
                body_tags,
                ingredients,
                email,
                // difficulty,
                duration,
                instructions,
                skin_concern,

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
            const db = MongoUtil.getDB();
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
            const db = MongoUtil.getDB();

            let username = req.body.username;
            let email = req.body.email;
            let text = req.body.text;

            let commentInfo = 0;

            if (username.length < 3) {
                commentInfo += 1
            }
            if (!email.includes('@')) {
                commentInfo += 1
            }

            if (text.length < 1) {
                commentInfo += 1
            }
            console.log(commentInfo)
            if (commentInfo > 0) {
                return res.status(406).json({
                    'message': 'invalid comments'
                })
            } else {
                await db.collection(COLLECTION_ARTICLES).updateOne({
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
                res.status(200)
                res.json({
                    'message': 'succesful'
                })
            }
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
            const db = MongoUtil.getDB();

            let {
                username,
                email,
                text,
            } = req.body

            if (text.length < 5) {
                return res.status(406).json({
                    'message' : 'Please edit your comment, otherwise delete the comment'
                })
            }
            let checkEmail = await db.collection(COLLECTION_ARTICLES).findOne({
                "comments": {
                    "$elemMatch": {
                        'username': req.params.username,
                        'email': email
                    }
                }
            })
            if (!checkEmail) {
                return res.status(406).json({
                    'message': 'invalid email'
                })
            } else {
                await db.collection(COLLECTION_ARTICLES).updateOne({
                    'comments': {
                        '$elemMatch': {
                            'username': req.params.username
                        }
                    }
                }, {
                    '$set': {
                        'comments.$.username' : username,
                        'comments.$.text': text,
                        'comments.$.comment_date': new Date(),
                    }
                })
            }
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
            const db = MongoUtil.getDB();
            let {id, username, email} = req.body
            // find article that has the comment to be deleted

            // validate if username and email exists before allowing delete 
            let toDelete = await db.collection(COLLECTION_ARTICLES).findOne({
                '_id': ObjectId(req.params.id),
                "comments": {
                    "$elemMatch": {
                        'username': req.params.username,
                        'email': email
                    }
                }
            })

            if (!toDelete) {
                return res.status(406).json({
                    'message': 'user does not exist'
                })
            }

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
