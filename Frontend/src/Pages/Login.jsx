import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import "./Signup.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const navigation = useNavigate();
  const handleChange = ({ target: { name, value } }) => {
    setCredentials((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/login-user`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        },
      );
      const result = await response.json();

      if (result.success===false) {
        toast.error(result.message || "Unable to sign in. Please try again.");
        return;
      }

      toast.success(result.message || "Signed in successfully.");
      sessionStorage.setItem("token", result.token);
      console.log(sessionStorage.getItem("token"));
      setTimeout(() => {
          navigation("/");
          
      },3000)
    } catch (error) {
      console.log(error);
      toast.error("Unable to reach the server. Please try again.");
    }
  };

  useEffect(()=>{
    if(sessionStorage.getItem("token")){
      navigation("/")
    }
  },[])

  return (
    <>
      <Toaster position="top-center" />
      <main className="signin-page">
        <section
          className="signin-card login-card"
          aria-labelledby="login-title"
        >
          <aside className="signin-brand" aria-label="iNotebook introduction">
            <div className="brand-mark" aria-label="iNotebook">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.5 4.5h9a2 2 0 0 1 2 2v12a1 1 0 0 1-1.55.83L12 16.8l-3.95 2.53A1 1 0 0 1 6.5 18.5v-12a2 2 0 0 1 2-2Z" />
                <path d="M9 8h6M9 11h6" />
              </svg>
            </div>
            <div className="brand-copy">
              <p className="brand-label">iNOTEBOOK</p>
              <h2>
                Welcome
                <br />
                back.
              </h2>
              <p>Your notes and ideas are ready when you are.</p>
            </div>
            <div className="brand-detail">
              <span className="detail-line" />
              <p>Pick up exactly where you left off.</p>
            </div>
          </aside>

          <div className="signin-content">
            <div className="signin-heading">
              <p className="signin-kicker">WELCOME BACK</p>
              <h1 id="login-title">Sign in to iNotebook</h1>
              <p>Enter your details to continue to your workspace.</p>
            </div>

            <form className="signin-form" onSubmit={handleSubmit}>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={credentials.email}
                onChange={handleChange}
                required
              />

              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
                required
              />

              <button className="submit-button" type="submit">
                Sign in
              </button>
            </form>

            <p className="login-register-link">
              New to iNotebook? <Link to="/signup">Create an account</Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Login;
