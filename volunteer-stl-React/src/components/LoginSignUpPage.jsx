import { useState } from 'react';

export default function LoginSignUpPage({ setUser }) {

  const [loginPage, switchPage] = useState(true)

  return (
    loginPage ?
      (
        <div className=''>
          <h3>Login Page</h3>
          <button onClick={() => switchPage(!loginPage)}>Sign Up?</button>
        </div>
      ) :
      (
        <div className=''>
          <h3>Sign Up Page</h3>
          <button onClick={() => switchPage(!loginPage)}>Login?</button>
        </div>
      )
  );
}
