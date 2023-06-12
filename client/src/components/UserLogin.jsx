import { useState } from "react";
import { useNavigate } from "react-router-dom";
import  Cookies from 'js-cookie'

const initialUserDetail = {
  username: "",
  password: "",
};

const initialLoginError = {
  isShowError: false,
  errorMsg: "",
};

const UserLogin = () => {
  const navigate = useNavigate();

  const [userDetails, updateUserDetail] = useState(initialUserDetail);
  const [errorMsg, updateError] = useState(initialLoginError);

  const loginFormSubmittion = async (event) => {
    event.preventDefault();
    if (userDetails.password !== "" && userDetails.username !== "") {
      const userLoginData = {
        username: userDetails.username,
        password: userDetails.password,
      };
      const options = {
        method: "POST",
        body: JSON.stringify(userLoginData),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch("http://localhost:3000/login", options);
      const data = await response.json();
      console.log(response)
      if (response.ok === true) {
        Cookies.set("token", data, { expires: 1 });
        navigate('/', { replace: true });
      } else {
        updateError({ isShowError: true, errorMsg: data });
      }
    } else {
      updateError({
        isShowError: true,
        errorMsg: "Please fill all the details",
      });
    }
  };

  const changeInputFields = (event) => {
    updateError(initialLoginError);
    if (event.target.name === "username") {
      updateUserDetail({ ...userDetails, username: event.target.value });
    } else if (event.target.name === "password") {
      updateUserDetail({ ...userDetails, password: event.target.value });
    }
  };

  return (
    <div className="bg-[#89CFF0] p-5 h-[100vh] flex flex-row items-center justify-center">
      <form
        onSubmit={loginFormSubmittion}
        className="md:w-[300px] flex flex-col justify-center bg-white p-5 rounded-xl shadow"
      >
        <label htmlFor="userNameId" className="my-3">
          Username
        </label>
        <input
          onChange={changeInputFields}
          value={userDetails.username}
          id="userNameId"
          type="text"
          className="border outline-none p-1"
          name="username"
        />
        <label htmlFor="passwordId" className="my-3">
          Password
        </label>
        <input
          onChange={changeInputFields}
          value={userDetails.password}
          id="passwordId"
          type="password"
          className="border outline-none p-1"
          name="password"
        />
        <button
          onClick={loginFormSubmittion}
          type="submit"
          className="bg-black text-white my-5 rounded-lg py-1 font-bold"
        >
          Login
        </button>
        {errorMsg.isShowError && (
          <p className="text-center text-[red]">{errorMsg.errorMsg}</p>
        )}
      </form>
    </div>
  );
};

export default UserLogin;
