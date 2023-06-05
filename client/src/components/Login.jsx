import { useState } from "react";
import Cookies from 'js-cookie';
// Can use axios instead of fetch()

const initialUserData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const initialError = {isError: false, errorMsg: ''}

const Login = function () {
  const [registerData, updateRegister] = useState(initialUserData);
  const [errorSubmit, updateError] = useState(initialError);

  const changeInUserData = (event) => {
    updateError({isError: false, errorMsg: ""})
    const { name, value } = event.target;
    switch (name) {
      case "username":
        updateRegister({ ...registerData, username: value });
        break;
      case "email":
        updateRegister({ ...registerData, email: value });
        break;
      case "password":
        updateRegister({ ...registerData, password: value });
        break;
      case "confirmPassword":
        updateRegister({ ...registerData, confirmPassword: value });
        break;
      default:
        registerData;
    }
  };

  const clickedToSubmitRegister = async event => {
    event.preventDefault()
    const {username, password, email, confirmPassword} = registerData
    const allFilled =  username !== '' && password !== '' && confirmPassword !== '' && email !== ''
    if (allFilled === true){
       if(password === confirmPassword){
        const newUser = {
          username, password, email
        }
        const options = {
          method: 'POST',
          body: JSON.stringify(newUser),
          headers:{
            'Content-Type' : 'application/json'
          }
        }
        const response = await fetch(`http://localhost:3000/register`, options);
        const data = await response.json()
        const {token, msg} = data
        Cookies.set('token', token, { expires: 1 });
        updateRegister(initialUserData);
       }else{
        updateError({isError: true, errorMsg: "Password didn't matched"})
       }
    }else{
        updateError({isError: true, errorMsg: "*Fill all the required details"})
    }

  }
  
  return (
    <div className="h-[100vh] bg-[#89CFF0] md:w-100 flex flex-col justify-center items-center">
      <form onSubmit={clickedToSubmitRegister} className="bg-white p-5 m-5 md:w-[300px] max-w-[300px] rounded-xl flex flex-col justify-center items-left">
        <label htmlFor="userName">Username</label>
        <input
          onChange={changeInUserData}
          id="userName"
          type="text"
          name="username"
          className="border rounded outline-none p-1 mt-2 mb-2"
          value={registerData.username}
        />
        <label htmlFor="email">Email</label>
        <input
          onChange={changeInUserData}
          id="email"
          type="email"
          name="email"
          className="border rounded outline-none p-1 mt-2 mb-2"
          value={registerData.email}
        />
        <label htmlFor="password">Password</label>
        <input
          onChange={changeInUserData}
          id="password"
          type="password"
          name="password"
          className="border rounded outline-none p-1 mt-2 mb-2"
          value={registerData.password}
        />
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          onChange={changeInUserData}
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          className="border rounded outline-none p-1 mt-2 mb-2"
          value={registerData.confirmPassword}
        />
        <button
          type="submit"
          className="bg-black text-white font-bold px-5 py-2 rounded-xl my-5"
          onClick={clickedToSubmitRegister}
        >
          Register
        </button>
        {errorSubmit.isError && <p className="text-[red] text-center text-sm">{errorSubmit.errorMsg}</p>}
      </form>
    </div>
  );
};

export default Login;
