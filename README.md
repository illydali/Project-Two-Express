# Beauty From Home API 

A backend API built using NodeJS Express and MongoDb to connect to front-end that is built using React. 

Deployed API link: https://beauty-from-home.herokuapp.com

Frontend repository: https://github.com/illydali/Project-Two-FrontEnd-React

Upon successful connection, the following message will be displayed. 

'Welcome to the Skin Lang. API!'

# Routes

## GET
To view all articles in the collection 
```
https://beauty-from-home.herokuapp.com/articles
```
To request query parameters
```
https://beauty-from-home.herokuapp.com/articles/search
```
Params accepted:
* title
* description
* filter duration
* body_tags
* skin_concern

To view each article
```
https://beauty-from-home.herokuapp.com/article/:id
```

To view comments in each article
```
https://beauty-from-home.herokuapp.com/article/:id/comments
```

## POST
To create a new document in collection
```
https://beauty-from-home.herokuapp.com/article
```

To create a new comment in an article
```
https://beauty-from-home.herokuapp.com/article/:id/comments/create
```

## PATCH
To edit certain elements of a document
```
https://beauty-from-home.herokuapp.com/article/:id
```

## PUT
To edit selected comment in an article
```
https://beauty-from-home.herokuapp.com/article/:id/comments/:comment_id
```

## DELETE
To delete a document in the collection
```
https://beauty-from-home.herokuapp.com/article/:id
```

To delete a comment in an article
```
https://beauty-from-home.herokuapp.com/article/:id/comments/:comment_id
```

# Testing 
All testing for this API was conducted via [Advanced Rest Client](https://install.advancedrestclient.com/install)