import React from 'react'
import { useState } from 'react'
import {useNavigate} from "react-router-dom"
import axios from "axios"
import { Link } from 'react-router-dom'


const Register = ()=>{
    const [fullname, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword]= useState("");
    const [username,setUsername] = useState("");
    const [error,setError] = useState("");
    const navigate = useNavigate();
    const handleRegister = async(e)=>{
        e.preventDefault();
        try {
            const {data} = await axios.post("/api/v1/users/register",{fullname,email,username,password}, {withCredentials:true});
            if (data.success){
                navigate("/login");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed")
            
        }
    };
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-bold mb-4 flex justify-center items-center">Register</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleRegister}>
              <input type="text" className="w-full p-2 border rounded mb-2" placeholder="Full Name" value={fullname} onChange={(e) => setFullName(e.target.value)} required />
              <input type="email" className="w-full p-2 border rounded mb-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="phone" className="w-full p-2 border rounded mb-2" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              <input type="password" className="w-full p-2 border rounded mb-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Register</button>
            </form>
            <p className=" flex justify-center items-center mt-3">Already Logged In? <Link to ="/login" className="text-blue-700"> LogIn</Link></p>
          </div>
        </div>
      );
    
}

export default Register
