import React , {useContext, useState} from 'react';
import NoteContext from '../context/notes/NoteContext';

const AddNote = (props) => {
  const context = useContext(NoteContext);
  const {addNote}=context;


  //using useState hook 

  const initialNote={
    title: "",
    description: "",
    tag: ""
  }
  const [note, setNote] = useState(initialNote);
  
  const onChange=(e)=>{
    setNote({...note,[e.target.name]: e.target.value});      //we have use spread operator // jo properties h unko rhne do and add or overwrite the new properties
  }
  const handleAddNote=(e)=>{
    e.preventDefault();
    addNote(note.title, note.description, note.tag);
    setNote({title: "",
        description: "",
        tag: ""
    })
    props.showAlert("Note added successfully" , "success");
  }
  return (
    <div>
      <div className="container">
            <h2>Add a note</h2>
            {/* form to enter notes */}

            <form>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name="title"  onChange={onChange} value={note.title}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name="description" onChange={onChange} value={note.description}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tag" name="tag" onChange={onChange} value={note.tag}/>
                </div>
                <button disabled={note.title.length<3 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleAddNote}>Add Note</button>
            </form>
        </div>
    </div>
  )
}

export default AddNote
