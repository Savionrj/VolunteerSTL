import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginSignUpPage({ setUser }) {

  const [loginPage, switchPage] = useState(true)

  const nav = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const userDTO = await response.json();
        setUser(userDTO);
        nav('/');
      } else if (response.status === 401) {
        console.error("Invalid password.");
      } else if (response.status === 404) {
        console.error("User not found.");
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }

  }

  const handleRegistration = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const userDTO = await response.json();
        setUser(userDTO);
        nav('/');
      } else if (response.status === 409) {
        console.error("Username already taken.");
      } else {
        console.error("Registration failed.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className='flex flex-col items-center justify-around h-screen bg-[#162c64] text-white'>
      <h3 className='font-bold sm:text-6xl md:text-8xl lg:text-9xl'>VOLUNTEER STL</h3>

      {loginPage ?
        (
          <>
            <form className='flex flex-col' onSubmit={handleLogin}>
              <label className='flex flex-col py-4'>
                Username:
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className='border border-gray-300 rounded-sm p-1 h-fit bg-white text-black'
                />
              </label>
              <label className='flex flex-col py-4'>
                Password:
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className='border border-gray-300 rounded-sm p-1 h-fit bg-white text-black'
                />
              </label>
              <button type="submit" className="text-3xl py-5">Login</button>
            </form>

            <button className="text-1xl" onClick={() => switchPage(!loginPage)}>Don't Have an Account?<br />Sign Up</button>
          </>) :
        (
          <>
            <form className='grid grid-cols-2 gap-4' onSubmit={handleRegistration}>
              <label className='flex flex-col py-4'>
                Username:
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className='border border-gray-300 rounded-sm p-1 h-fit bg-white text-black'
                />
              </label>
              <label className='flex flex-col py-4'>
                Password:
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className='border border-gray-300 rounded-sm p-1 h-fit bg-white text-black'
                />
              </label>
              <label className='flex flex-col py-4'>
                First Name:
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className='border border-gray-300 rounded-sm p-1 h-fit bg-white text-black'
                />
              </label>
              <label className='flex flex-col py-4'>
                Last Name:
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className='border border-gray-300 rounded-sm p-1 h-fit bg-white text-black'
                />
              </label>
              <label className='flex flex-col py-4'>
                Email:
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className='border border-gray-300 rounded-sm p-1 h-fit bg-white text-black'
                />
              </label>
              <button type="submit" className="text-3xl py-5">Sign Up</button>
            </form>

            <button className="text-1xl" onClick={() => switchPage(!loginPage)}>Already Have an Account?<br />Login</button>
          </>)}
    </div>
  )
}
