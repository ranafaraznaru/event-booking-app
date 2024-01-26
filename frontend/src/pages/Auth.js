import React, { useContext, useState } from "react";
import { AuthContext } from "../components/context/auth-context";
import "./Auth.css";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const switchModeHandler = () => {
    setIsLogin(!isLogin);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    const requestBody = isLogin
      ? {
          query: `
            query {
              login(email: "${email}", password: "${password}") {
                userId
                token
                tokenExpiration
              }
            }
          `,
        }
      : {
          query: `
            mutation {
              createUser(userInput: { email: "${email}", password: "${password}" }) {
                _id
                email
              }
            }
          `,
        };

    try {
      const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resData = await response.json();
      console.log(resData);
      if (resData.data.login.token) {
        login(
          resData.data.login.token,
          resData.data.login.userId,
          resData.data.login.tokenExpiration
        );
      }
      // Handle successful response here
    } catch (error) {
      console.error(error);
      // Handle error here
    }
  };

  return (
    <form className="auth-form" onSubmit={submitHandler}>
      <div className="form-control">
        <label htmlFor="email">E-Mail</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="form-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={switchModeHandler}>
          Switch to {isLogin ? "Signup" : "Login"}
        </button>
      </div>
    </form>
  );
}

export default AuthPage;
