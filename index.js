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

    // test reading & search criterias

    app.get('/articles', async function (req, res) {
        // create citeria object (assumption: the user wants everything)
        let criteria = {};

        if (req.query.title) {
            criteria['title'] = {
                '$regex': req.query.title,
                '$options': 'i'
            }
        }

        if (req.query.ingredients) {
            criteria['coconut oil'] = {
                '$in': [req.query.ingredients]
            }
        }

        const db = MongoUtil.getDB();
        let allArticles = await db.collection(COLLECTION_ARTICLES).find(criteria).toArray();
        res.json({
            'article': allArticles
        })
    })

    // test creating

    app.post('/article', async function (req, res) {

        try {

            let title = req.body.title;
            let image_url = req.body.image_url;
            let datetime = new Date(req.body.post_date);
            let bodyparts_tag = req.body.bodyparts_tag.split(",");
            let ingredients = req.body.ingredients;
            let difficulty = req.body.difficulty;
            let duration = req.body.duration;
            let instructions = req.body.instructions

            // insert into mongo database
            const db = MongoUtil.getDB();
            

            await db.collection(COLLECTION_ARTICLES).insertOne({
                'title': title,
                'image_url': image_url,
                'post_date': datetime,
                'bodyparts_tag': bodyparts_tag,
                'ingredients' : ingredients,
                'difficulty': difficulty,
                'duration': duration,
                'instructions': instructions,

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
}

main();

app.listen(3000, () => {
    console.log("Server has started")
})
