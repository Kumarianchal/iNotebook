import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {

  const [credentials, setCredentials] = useState({name:"", email:"", password:"", cpassword:""});

  const onChange=(e)=>{
    setCredentials({...credentials,[e.target.name]: e.target.value});      //we have use spread operator // jo properties h unko rhne do and add or overwrite the new properties
  }
 
  const navigate=useNavigate();

  const handleSignup=async (e)=>{
    
    e.preventDefault();
    const url="http://localhost:5000/api/auth/createuser";
    const response = await fetch(url,{
        method:"POST",
        headers:{
            'Content-type':"application/json"
        },
        body : JSON.stringify({name:credentials.name, email:credentials.email, password:credentials.password})
        
    })
    const json=await response.json();
    console.log(json);
    
    if(json.success){
        //save the auth token and redirect
        localStorage.setItem('token', json.authToken);
        navigate("/");     //upon successful signup redirect to home
        props.showAlert("Account created successfully", 'success');
    }else{
        props.showAlert(json.error, 'danger');
    }
  }

  return (
    <div>
      <h1 className='my-3'>Create an account to use iNoteook</h1>
      <form onSubmit={handleSignup}>
        <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" name="name"   value={credentials.name} onChange={onChange} required minLength={3}/>
        </div>
        <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" name="email" value={credentials.email}  onChange={onChange} required aria-describedby="emailHelp"/>
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" name="password"  value={credentials.password} onChange={onChange} required minLength={5} />
        </div>
        <div className="mb-3">
            <label htmlFor="cpassword" className="form-label">Confirm Password</label>
            <input type="password" className="form-control" id="cpassword" name="cpassword"  value={credentials.cpassword} onChange={onChange} required minLength={5} />
        </div>
       
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  )
}

export default Signup
