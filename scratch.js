const { ObjectID } = require("bson")
const { ObjectId } = require("mongodb")

// sample document
"beautyhacks" = [
    {
        "_id": ObjectId,
        // "article_id": 001,
        "title": "Hydrating Coconut Oil and Honey Mask",
        "image" : "cocooil_honey.jpg",
        "date": yyyy-mm-dd,
        "body_tags": ["face", "neck", "chest"],
        "ingredients": [
            {
                "_id": ObjectId,
                "quantity" : "1 tsp"
            },
            {
                "_id": ObjectId,
                "quantity" : "1 tsp"
            }
        ],
        "difficulty": 1, // 1-5
        "duration" : 15, // for $gte $lte search
        "instructions": {
            1: "Mix coconut oil and honey until combined",
            2: "Apply to freshly cleansed skin in an even layer",
            3: "Leave the mask on for 15 minutes",
            4: "Rinse with warm water and pat dry",
        },
        "skin_concern" : [ObjectId, ObjectID], // (type) dry / sensitive
        "comments" : [
            {
                "username" : "misterblach",
                "email" : "",
                "text" : "why so difficult",
                "timestamp" : "timestamp", // time?
            },
            {
                "username" : "mistress woman",
                "email" : "",
                "text" : "such awesome",
                "timestamp" : "timestamp", // time?
            }
        ]
        
    }
]


"ingredients" = [
    {
        "_id": ObjectId,
        "name" : "coconut oil",
        "benefit" : "antibacterial and antifungal properties",
    },
    {
        "_id": ObjectId,
        "name": "honey",
        "benefit" : "helps to deeply penetrate the skin, soften the skin layers and work to remove impurities from pores including dirt that causes blackheads",
    },
    {
        "_id": ObjectId,
        "name": "tumeric",
        "benefit" : "",
    },
    {
        "_id": ObjectId,
        "name" : "egg whites",
        "benefit" : "natural antibacterial that helps prevents clogged pores",
    },
    {
        "_id": ObjectId,
        "name" : "lemon",
        "benefit" : "",
    },
    {
        "_id": ObjectId,
        "name" : "avocado",
        "benefit" : "",
    },
    {
        "_id": ObjectId,
        "name" : "baking soda",
        "benefit" : 'a natural, gentle abrasive that exfoliates your skin while absorbing excess oil and impurities that are buried'


    }
]

"skin_concern" = [
    {   
        "_id": "62396886a2fdf6b678f3ddcb",
        "type" : "dry",
        "article_id" : [ObjectId, ObjectId]
    },
    {
        "_id": ObjectId,
        "type" : "oily",
        "article_id" : ObjectId,
    },
    {
        "_id": ObjectId,
        "type" : "sensitive",
        "article_id" : ObjectId
    },
    {
        "_id": ObjectId,
        "type" : "acne",
        "article_id" : ObjectId
    }
]

// ----------------------------------------- //

// POST - add a new article 

// {       
//         "title": string,
//         "image" : string,
//         "post_date": string,
//         "body_tags": array of strings,
//         "ingredients": [
//             {
//                 "ingredient_id": 100,
//                 "quantity" : "1 tsp"
//             },
//             {
//                 "ingredient_id": 101,
//                 "quantity" : "2 drops"
//             }
//         ],
//         "difficulty": integer, // 1-5
//         "duration" : integer, // for $gte $lte search
//         "instructions": [{ array of strings
//             // 1: "mix ingredients together",
//             // 2: "spoon onto your face",
//             // 3: "leave on for 10 mins",
//             // 4: "wash face and pat dry",
//         }],
//         "skin_concern" : "string",
//     }
// }

// // POST - when user posts a comment
// {
//     "comments": string
//     "username": string
//     "article_id": ObjectID()
//     "user_id": integer
// }