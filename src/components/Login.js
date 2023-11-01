import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const [credentials, setCredentials] = useState({email:"", password:""});

  const onChange=(e)=>{
    setCredentials({...credentials,[e.target.name]: e.target.value});      //we have use spread operator // jo properties h unko rhne do and add or overwrite the new properties
  }
  
  let navigate = useNavigate();

  const handleLogin=async (e)=>{
    
    e.preventDefault();
    const url="http://localhost:5000/api/auth/login";
    const response = await fetch(url,{
        method:"POST",
        headers:{
            'Content-type':"application/json"
        },
        body : JSON.stringify({email:credentials.email, password:credentials.password})
        
    })
    const json=await response.json();
    console.log(json);
    
    if(json.success){
        //save the auth token and redirect
        localStorage.setItem('token', json.authToken);
        props.showAlert("Logged in successfully", 'success');
        navigate("/");     //upon successful login redirect to home
    }else{
        props.showAlert(json.error, 'danger');
    }
    
  }

  return (
    <div>
      <h1 className="my-3">Login to continue to iNotebook</h1>
      <form  onSubmit={handleLogin}>
        <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" name="email" value={credentials.email} onChange={onChange} aria-describedby="emailHelp"/>
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" name="password" value={credentials.password} onChange={onChange} id="password"/>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default Login
