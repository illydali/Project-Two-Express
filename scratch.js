const { ObjectId } = require("mongodb")

// sample document
"beautyhacks" = [
    {
        "_id": ObjectId,
        "article_id": 001,
        "title": "Hydrating Coconut Oil and Honey Mask",
        "image" : "url",
        "post_date": yyyy-mm-dd,
        "bpdy_tags": ["eyes", "nose"],
        "ingredients": [
            {
                "_id": ObjectId,
                "quantity" : "1 tsp"
            },
            {
                "_id": ObjectId,
                "quantity" : "2 drops"
            }
        ],
        "difficulty": 1, // 1-5
        "duration" : 10, // for $gte $lte search
        "instructions": {
            1: "mix ingredients together",
            2: "spoon onto your face",
            3: "leave on for 10 mins",
            4: "wash face and pat dry",
        },
        "skin_concern" : "dry",
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
        "type" : "coconut oil",
        "benefit" : "antibacterial and antifungal properties",
    },
    {
        "_id": ObjectId,
        "type": "honey",
        "benefit" : "",
    },
    {
        "_id": ObjectId,
        "type": "tumeric",
        "benefit" : "",
    },
    {
        "_id": ObjectId,
        "type" : "egg whites",
        "benefit" : "natural antibacterial that helps prevents clogged pores",
    },
    {
        "_id": ObjectId,
        "type" : "lemon",
        "benefit" : "",
    },
    {
        "_id": ObjectId,
        "type" : "avocado",
        "benefit" : "",
    },
    {
        "_id": ObjectId,
        "type" : "baking soda",
        "benefit" : `contains anti-inflammatory and antibacterial qualities that aid in the 
                    treatment of greasy skin. It is a natural, gentle abrasive that will gently 
                    exfoliate your skin while absorbing excess oil and impurities that are buried in the skin,`

    }
]

"skin_concern" = [
    {   
        "_id": ObjectId,
        "skin_type" : "dry",
        "article_id" : [ObjectId, ObjectId]
    },
    {
        "_id": ObjectId,
        "skin_type" : "oily",
        "article_id" : ObjectId,
    },
    {
        "_id": ObjectId,
        "skin_type" : "combi",
        "article_id" : ObjectId
    }
]

// ----------------------------------------- //

// POST - add a new article 

// {       
//         "title": string,
//         "image_url" : string,
//         "post_date": string,
//         "body_part_tags": array of strings,
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