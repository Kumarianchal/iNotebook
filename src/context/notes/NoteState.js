import React, { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState=(props)=>{
  const host="http://localhost:5000";
  const [notes , setNotes ] = useState([])


    //get notes
    const getNotes=async ()=>{
      //API call
      const url=`${host}/api/notes/fetchallnotes`;
      const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
      });
      const json = await response.json(); // parses JSON response into native JavaScript objects
      setNotes(json);
      
    }


    //add note
    const addNote=async (title,description,tag)=>{
      //API call
      const url=`${host}/api/notes/addnote`;
      const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({title,description,tag}) // body data type must match "Content-Type" header
      });
      const json = await response.json(); // parses JSON response into native JavaScript objects
      

      const note=json;
      setNotes(notes.concat(note));
      console.log("New Note added");
    }

    //edit note
   
    const editNote=async (id, title, description, tag)=>{

      //API call
      const url=`${host}/api/notes/updatenote/${id}`;
      const response = await fetch(url, {
        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({title,description,tag}) // body data type must match "Content-Type" header
      });
      const json =await  response.json(); // parses JSON response into native JavaScript objects
      console.log("Edited: ");
      console.log(json);

      for (let index = 0; index < notes.length; index++) {
        const element = notes[index];
        if(element._id===id){
          element.title=title;
          element.description=description;
          element.tag=tag
        }
      }
    }

    //delete note
    const deleteNote=async (id)=>{

      //API call
      const url=`${host}/api/notes/deletenote/${id}`;
      const response = await fetch(url, {
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        }
      });
      const json = await response.json();

      console.log(`delete : ${id}`);
      console.log(json);
      const notesAfterDel =notes.filter((note)=>{
          return note._id!==id
        })
      setNotes(notesAfterDel);  //updating the state notes
    }

    return(
        <NoteContext.Provider value={{notes, addNote, editNote, deleteNote, getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}
export default NoteState;