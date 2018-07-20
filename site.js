const express = require('express');
const router = express.Router();
const path = require('path');

// Multer Configuration
const multer  = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, 'public/img');
    },
    filename: function(req, file, callback) {
      callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
const upload = multer({ storage: storage });

// MongoDB configuration
const MongoClient = require('mongodb').MongoClient;
const databaseName = 'blog';
const collectionName = 'recipes';
const mongodbURL = 'mongodb://localhost:27017';
const ObjectID = require('mongodb').ObjectID;

const categories = [
    'Cake',
    'Desserts',
    'Breakfast',
    'Lunch',
    'Dinner',
    'Healthy food'
];

// Routes
router.get('/', (req, res) => {
    res.render('index', { categories: categories });
});

router.get('/about', (req, res) => {
    res.render('about', { categories: categories });
});

router.get('/contactme', (req, res) => {
    res.render('contactme', { categories: categories });
});

router.get('/recipes', (request, response) => {

    MongoClient.connect(mongodbURL, (connectError, client) => {
        const database = client.db(databaseName);
        const collection = database.collection(collectionName);

        collection.find({}).toArray((findError, recipes) => {
            response.render('recipes', { categories: categories, recipes: recipes });
        })
    });
});

router.get('/add', (req, res) => {
    res.render('add', { categories: categories });
});

router.post('/recipes/create', upload.single('image'), (request, response) => {
    const recipe = {
        name: request.body.name, 
        ingredients: request.body.list.split(', '),
        image: request.file ? request.file.filename : '', 
        metodh: request.body.metodh,
        categories: []
    }

    MongoClient.connect(mongodbURL, (connectError, client) => {
        const database = client.db(databaseName);
        const collection = database.collection(collectionName);

        collection.insertOne(recipe, (insertError, result) => {
            response.redirect('/recipes'); 
        });

    });
});

router.get('/recipe/:id', (request, response) => {
    const recipeID = request.params.id;
    
    MongoClient.connect(mongodbURL, (connectError, client) => {
        const database = client.db(databaseName);
        const collection = database.collection(collectionName);

        collection.find({ _id: ObjectID(recipeID)}).toArray((findError, recipes) => {
            const recipe = recipes[0];
            response.render('recipe', {
                recipe: recipe,
                categories: categories
            });
        });
    });
});



module.exports = router;