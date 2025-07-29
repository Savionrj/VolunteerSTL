import { useState } from 'react';

export default function LoginSignUpPage({ setUser }) {

  const [loginPage, switchPage] = useState(true)

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (loginPage) {

    }

  }

  const handleChange = () => {
    setFormData((prev) => ({
      ...prev
    }));
  };

  return (
    loginPage ?
      (
        <div className='flex flex-col items-center justify-around h-screen'>
          <h3 className='text-9xl font-bold text-[#1F1D8F]'>VOLUNTEER STL</h3>

          <form className='flex flex-col' onSubmit={handleSubmit}>
            <label className='flex flex-col py-4'>
              Username:
              <input
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                className='border border-gray-300 rounded-sm p-1 h-fit'
              />
            </label>
            <label className='flex flex-col py-4'>
              Password:
              <input
                type="text"
                value={formData.password}
                onChange={handleChange}
                required
                className='border border-gray-300 rounded-sm p-1 h-fit'
              />
            </label>
            <button type="submit" className="text-3xl py-5">Login</button>
          </form>

          <button className="text-1xl" onClick={() => switchPage(!loginPage)}>Don't Have an Account?<br />Sign Up</button>
        </div>
      ) :
      (
        <div className=''>
          <h3>Sign Up Page</h3>

          <div>

          </div>

          <button onClick={() => switchPage(!loginPage)}>Login?</button>
        </div>
      )
  );
}
