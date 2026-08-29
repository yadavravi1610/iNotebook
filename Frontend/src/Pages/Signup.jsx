import { useEffect, useState } from "react";
import "./Signup.css";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";

const Signup = () => {
  const [formStatus, setFormStatus] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [emailOnly, setEmailOnly] = useState("");

  const navigation = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/user/create-new-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: emailOnly,
          mobile: formData.mobile,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          otp: formData.otp,
        }),
      },
    );

    const json = await response.json();

    console.log(json);
    //
    if (json.success === false) {
      toast.error(json.message);

      return;
    } else {
      toast.success(json.message);
      console.log(json.message);
      setTimeout(() => {
        navigation("/login");
      }, 3000);
    }
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/user/send-otp-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailOnly }),
      },
    );

    const json = await response.json();
    // console.log(json);

    if (json.success === true) {
      toast.success("OTP sent successfully");
      setFormStatus(true);
      return;
    }
    toast.error("Something went wrong/ Email already Exists");
  };

  useEffect(() => {
    if (sessionStorage.getItem("toke")) {
      navigation("/");
    }
  }, []);

  return (
    <>
      <Toaster position="top-center" />
      <main className="signin-page">
        <section className="signin-card" aria-labelledby="signin-title">
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
                Make every idea
                <br />
                count.
              </h2>
              <p>
                Bring your notes, plans, and priorities into one focused space.
              </p>
            </div>
            <div className="brand-detail">
              <span className="detail-line" />
              <p>“A calm place for your best thinking.”</p>
            </div>
          </aside>
          <div className="signin-content">
            <div className="signin-heading">
              <p className="signin-kicker">GET STARTED</p>
              <h1 id="signin-title">Create your account</h1>
              <p>Start organizing your work in minutes.</p>
            </div>
            {formStatus ? (
              <form className="signin-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={emailOnly}
                  onChange={handleChange}
                  restricted="true"
                  required
                />

                <label htmlFor="mobile">Mobile number</label>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter your mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />

                <div className="signin-row">
                  <div>
                    <label htmlFor="password">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <label htmlFor="otp">OTP</label>
                <div className="otp-field">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength="6"
                    placeholder="Enter 6-digit OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button className="submit-button" type="submit">
                  Create account
                </button>
              </form>
            ) : (
              <form className="email-only-form" onSubmit={handleEmailSubmit}>
                <label htmlFor="emailOnly">Continue with email</label>
                <div className="email-only-field">
                  <input
                    id="emailOnly"
                    type="email"
                    placeholder="you@example.com"
                    value={emailOnly}
                    onChange={(event) => {
                      setEmailOnly(event.target.value);
                    }}
                    required
                  />
                  <button className="email-submit-button" type="submit">
                    Continue
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default Signup;
