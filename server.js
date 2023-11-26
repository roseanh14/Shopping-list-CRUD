const express = require('express');
const mongoose = require('mongoose');
const List = require('./models/list.Model');
const app = express();
const { body, validationResult } = require('express-validator');
const { authorize } = require('./auth');

app.use(express.json());

// routes

app.post('/protected-route', authorize, (req, res) => {
    res.json({ message: 'Protected route accessed successfully' });
});

app.get('/', (req, res) => {
    res.send('Hello NODE API');
});

app.get('/list', async (req, res) => {
    try {
        const list = await List.find({});
        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/list/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const list = await List.findById(id);
        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/createlist', [
    body('listName').notEmpty().withMessage('List name is required'),
    body('items').isArray().withMessage('Items must be an array'),
    
], async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const list = await List.create(req.body);
        res.status(200).json(list);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

// update list
app.put('/list/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Update listName and items
        const updatedList = await List.findByIdAndUpdate(
            id,
            {
                listName: req.body.listName,
                items: req.body.items,
            },
            { new: true }
        );

        if (!updatedList) {
            return res.status(404).json({ message: `Cannot find any list with ID ${id}` });
        }

        res.status(200).json(updatedList);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

app.delete('/list/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const list = await List.findByIdAndDelete(id);

        if (!list) {
            return res.status(404).json({ message: `Cannot find any list with ID ${id}` });
        }
        res.status(200).json(list);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

mongoose.set("strictQuery", false);

mongoose.connect('mongodb+srv://admin:admin@cluster1.x73kwvs.mongodb.net/Node-API?retryWrites=true&w=majority')
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(3000, () => {
            console.log('Node API app is running on port 3000');
        });
    })
    .catch((error) => {
        console.log(error);
    });