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
async function main(){
    await MongoUtil.connect(process.env.MONGO_URI, "test_homemade");

    app.get('/welcome', function(req,res){
        res.json({
            'message':'Welcome to my beauty hack !'
        })
    })

    // test reading 
    
    app.get('/articles', async function(req,res){
        // create citeria object (assumption: the user wants everything)
        let criteria = {};

        if (req.query.title) {
            criteria['title'] = {
                '$regex': req.query.title,
                '$options':'i'
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

}

main();

app.listen(3000, ()=>{
    console.log("Server has started")
})
