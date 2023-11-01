const express=require('express');
const router=express.Router();
const fetchuser=require('../middleware/fetchuser');
const Note=require('../models/Note');
const {body, validationResult} = require('express-validator');
const { findById } = require('../models/Note');
const { route } = require('./auth');

//Roue 1: Get all the notes: GET:"/api/notes/fetchallnotes". login required
router.get('/fetchallnotes',fetchuser, async (req,res)=>{
    try {
        const notes=await Note.find({user: req.user.id});
        res.json(notes); 
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
})

//Route 2: Add a note: POST:"/api/notes/addnote". login required
router.post('/addnote',fetchuser,[
    body('title','title should be at least of 3 characters').isLength({ min: 3 }),
    body('description','description should be at least of 5 characters').isLength({ min: 5 })
], async (req,res)=>{
    try {
        const {title, description, tag} = req.body;
        //If there are errors return error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        //else create a new note
        const note= new Note({
            title, description, tag, user:req.user.id
        })
        //save into database
        const savedNote=await note.save();
        res.json(savedNote);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
    
})

//Route 3: Update a note: PUT:"/api/notes/updatenote/:id". login required
router.put('/updatenote/:id',fetchuser, async (req,res)=>{
    try {
        const {title, description, tag} = req.body;

        //create anew note object
        const newNote={};
        if(title){newNote.title=title};
        if(description){newNote.description=description};
        if(tag){newNote.tag=tag};

        //find the note to be updated and update it
        let note=await Note.findById(req.params.id);

        //if no note of the given id is found
        if(!note){
            return res.status(404).send("Note not found");
        }
        //if note's user id does not match with the user who is logged in
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("You are not allowed to access this note")
        } 
        note=await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
        res.json(note);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
    
}) 


//ROUTE 4 : delete a note: DELETE: "/api/notes/deletenote/:id". login required
router.delete('/deletenote/:id',fetchuser,async (req,res)=>{
    try {
        let note=await Note.findById(req.params.id);
        if(!note){
            return res.status(404).send("Note not found");
        }
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("You are not allowed to access this note");
        }
        note= await Note.findByIdAndDelete(req.params.id);
        res.json({"success": "Note has been deleted",note:note});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
    
})
module.exports=router;