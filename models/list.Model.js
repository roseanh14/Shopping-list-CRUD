const mongoose = require('mongoose');

const listSchema = mongoose.Schema(
    {
        listName: {
            type: String,
            required: [true, "Enter list name"]
        },
        items: [
            {
                name: {
                    type: String,
                    required: [true, "Enter items"]
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 0
                }
            }
        ],
        archived: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const List = mongoose.model('List', listSchema);

module.exports = List;