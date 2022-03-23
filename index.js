const express = require('express');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const MongoUtil = require('./MongoUtil');

// Three parts of an Express application

// Setup
const app = express();

// enable JSON data processing
app.use(express.json());

// enable CORS 
app.use(cors());

const COLLECTION_ARTICLES = "beautyhacks"


// add routes here
async function main() {
    await MongoUtil.connect(process.env.MONGO_URI, "test_homemade");

    app.get('/welcome', function (req, res) {
        res.json({
            'message': 'Welcome to my beauty hack !'
        })
    })

    // test reading & search engine! 

    app.get('/articles', async function (req, res) {
        // create citeria object (assumption: the user wants everything)
        let criteria = {};

        // query equals everything after ? --- example: ?title=honey&body_tags=eyes

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
    })

    // test creating

    app.post('/article', async function (req, res) {

        try {

            let title = req.body.title;
            let image = req.body.image;
            let date = new Date(req.body.date); // format has to be "2022-03-06"
            let body_tags = req.body.body_tags.split(",");
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
    // updating a document aka edit 
    // note : similar method to creating a new article but using app.put & updateOne
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

    // delete something 
    app.delete('article/:id', async function (req,res) {
        try{
            await MongoUtil.getDB().collection(COLLECTION_ARTICLES).deleteOne({
                'id': ObjectId(req.params.id)
            })
            res.status(200);
            res.json({
                'message' : 'Document has been deleted'
            })
        } catch(e) {
            res.status(500);
            res.json({
                'message': "Unable to delete documents"
            })
            console.log(e) // to check the actual error message
        }
        
    })
}

main();

app.listen(3000, () => {
    console.log("Server has started")
})
