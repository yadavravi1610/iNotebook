const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "iNotebook_user_details",
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type:String,
        required: true
    }
}, {timestamps: true});

const NoteModel = mongoose.model("iNotebook_note_details", noteSchema);

module.exports = NoteModel