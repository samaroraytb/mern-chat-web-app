import { useState } from "react";
import Cookies from "js-cookie";
// Can use axios instead of fetch()

const initialUserData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const initialMessage = { isSuccess: false, isError: false, message: "" };

const Register = function () {
  const [registerData, updateRegister] = useState(initialUserData);
  const [message, updateMessage] = useState(initialMessage);

  const changeInUserData = (event) => {
    updateMessage({ isError: false, isSuccess: false, message: "" });
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

  const clickedToSubmitRegister = async (event) => {
    event.preventDefault();
    const { username, password, email, confirmPassword } = registerData;
    const allFilled =
      username !== "" &&
      password !== "" &&
      confirmPassword !== "" &&
      email !== "";
    if (allFilled === true) {
      if (password === confirmPassword) {
        const newUser = {
          username,
          password,
          email,
        };
        const options = {
          method: "POST",
          body: JSON.stringify(newUser),
          headers: {
            "Content-Type": "application/json",
          },
        };
        const response = await fetch(`http://localhost:3000/register`, options);

        const data = await response.json();
        if (response.ok === true) {
          Cookies.set("token", data, { expires: 1 });
          updateMessage({
            isError: false,
            isSuccess: true,
            message: "User Created Successfully",
          });
          updateRegister(initialUserData);
        } else {
          updateMessage({ isError: true, isSuccess: false, message: data });
        }
      } else {
        updateMessage({
          isError: true,
          isSuccess: false,
          message: "Password didn't matched",
        });
      }
    } else {
      updateMessage({
        isError: true,
        isSuccess: false,
        message: "*Fill all the required details",
      });
    }
  };

  return (
    <div className="h-[100vh] bg-[#89CFF0] md:w-100 flex flex-col justify-center items-center">
      <form
        onSubmit={clickedToSubmitRegister}
        className="bg-white p-5 m-5 md:w-[300px] max-w-[300px] rounded-xl flex flex-col justify-center items-left"
      >
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
        {(message.isError || message.isSuccess) && (
          <p className={`${message.isSuccess ? 'text-[green]' : 'text-[red]'} text-center text-sm`}>
            {message.message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Register;
