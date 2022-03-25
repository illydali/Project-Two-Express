db.beautyhacks.insertOne({
    'title' : 'Egg White Acne Mask',
    'image' : 'eggs.jpg',
    'date' : ISODate('2022-03-01'),
    'body_tags' : ['face'], // need string
    'ingredients' : [
        {
        '_id' : ObjectId('62396212a2fdf6b678f3ddc4'),
        'quantity' : '1 egg'
        },
        {
        '_id' : ObjectId('62396246a2fdf6b678f3ddc5'),
        'quantity' : '1 cup of warm water'
        }
        ],
    'difficulty' : 2,
    'duration' : 10,
    'instructions' : {
        1: 'Separate egg whites from the yolk and place egg whites in a bowl',
        2: 'Dip a cotton swab into the bowl and dab the egg whites over your face',
        3: 'Let the mask sit for 10 mins',
        4: 'Wash off with a damp cloth'
    },
    'skin_concern' : [
        ObjectId('62396f5051aece3932dcc542')
    ],
    'comments' : [
        {
        'username':'lil wayne',
        'email' : 'kingofthehill@singrap.com',
        'text' : 'i really need this',
        'comment_date' : ISODate('2022-03-02'),
        }
    ]
})


})
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
                "comment_date" : new Date(), 
            },
            {
                "username" : "mistress woman",
                "email" : "",
                "text" : "such awesome",
                "comment_date" : new Date(), 
            }
        ]
        
    }
]
