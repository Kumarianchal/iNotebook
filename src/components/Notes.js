import React, { useState, useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import NoteContext from '../context/notes/NoteContext';
import AddNote from './AddNote';
import Noteitem from './Noteitem';

const Notes = (props) => {
  const context = useContext(NoteContext);
  const {notes, getNotes, editNote}=context;

  let navigate= useNavigate();

  useEffect(() => {
    if(localStorage.getItem('token')){          //if token is set then only show notes
      getNotes();
    }
    else{     //else redirect to login page
      navigate("/login");
    }
  }, [getNotes, navigate])

  const ref = useRef(null);
  const refClose=useRef(null);

  const initialNote={
    id:"",
    etitle: "",
    edescription: "",
    etag: "general"
  }
  const [note, setNote] = useState(initialNote);
  
  
  const updateNote=(currentNote)=>{
    ref.current.click();
    setNote({
      id:currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag
    });
  }

  const onChange=(el)=>{
    setNote({...note,[el.target.name]: el.target.value});      //we have use spread operator // jo properties h unko rhne do and add or overwrite the new properties
  }
  const handleEditNote=(e)=>{
    e.preventDefault();
    editNote(note.id, note.etitle, note.edescription, note.etag);
    refClose.current.click();
    props.showAlert("Note updated successfully","success");
  }
  return (
    <div>
      <AddNote showAlert={props.showAlert}/>

      {/* <!-- Button trigger modal --> */}
      <button type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal" ref={ref}>
        Launch demo modal
      </button>

      {/* <!-- Modal --> */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              
              {/* form to edit note */}
              <form>
                  <div className="mb-3">
                      <label htmlFor="etitle" className="form-label">Title</label>
                      <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} onChange={onChange}/>
                  </div>
                  <div className="mb-3">
                      <label htmlFor="edescription" className="form-label">Description</label>
                      <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange}/>
                  </div>
                  <div className="mb-3">
                      <label htmlFor="etag" className="form-label">Tag</label>
                      <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange}/>
                  </div>
              </form>
              
            </div>
            <div className="modal-footer">
              <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button disabled={note.etitle.length<3 || note.edescription.length<5} type="button" className="btn btn-primary" onClick={handleEditNote}>Update Note</button>
            </div>
          </div>
        </div>
      </div>


      <div className="row my-3">
        <h2>Your notes</h2>
        <div className='container'>
          {notes.length===0 && "No notes to display! "}
        </div>
        {notes.map((note)=>{
            return <Noteitem key={note._id} updateNote={updateNote} note={note} showAlert={props.showAlert}/>
        })}
      </div>
    </div>
  )
}

export default Notes
