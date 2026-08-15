import { useState } from "react";
import { MapPin} from "lucide-react";
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    if (form.checkValidity()) {
      window.location.href = "/profile"; 
    } else {
      form.reportValidity();
    }
  };
  

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .login-page {
          margin: 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0c12;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          padding: 24px;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          background: #171b26;
          border: 1px solid #2a3040;
          border-radius: 22px;
          padding: 36px 32px 28px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.45);
        }

        .brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 28px;
        }


        .brand span {
          font-size: 19px;
          font-weight: 700;
          color: #f3f4f6;
          letter-spacing: -0.01em;
        }

        .login-title {
          font-size: 22px;
          font-weight: 700;
          color: #f3f4f6;
          margin: 0 0 6px;
        }

        .subtitle {
          color: #9aa1b1;
          font-size: 14px;
          margin: 0 0 26px;
        }

        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #9aa1b1;
          margin-bottom: 8px;
        }

        .field-group { margin-bottom: 18px; }

        .field-wrap { position: relative; }

        .custom-input {
          width: 100%;
          background: #12151f;
          border: 1px solid #2c3242;
          border-radius: 12px;
          padding: 14px 16px;
          color: #f3f4f6;
          font-size: 15px;
          outline: none;
          transition: border-color 0.15s ease;
        }

        .custom-input::placeholder { color: #5b6274; }

        .custom-input:focus { border-color: #e6a94f; }

        .custom-input[type="password"] { padding-right: 64px; }

        .toggle-visibility {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #9aa1b1;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          padding: 4px;
        }

        .toggle-visibility:hover { color: #f3f4f6; }

        .row-between {
          display: flex;
          justify-content: flex-end;
          margin: -6px 0 22px;
        }

        .forgot-link {
          color: #e6a94f;
          font-size: 13px;
          text-decoration: none;
          font-weight: 500;
        }

        .forgot-link:hover { text-decoration: underline; }

        .btn-custom-primary {
          width: 100%;
          background: #e6a94f;
          border: none;
          border-radius: 14px;
          padding: 15px;
          color: #201404;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.05s ease;
        }

        .btn-custom-primary:hover { background: #caa14a; }
        .btn-custom-primary:active { transform: scale(0.99); }

        .signup-prompt {
          text-align: center;
          color: #f3f4f6;
          font-size: 14px;
          margin-top: 22px;
        }

        .signup-link {
          color: #f3f4f6;
          font-weight: 600;
          text-decoration: none;
        }

        .signup-link:hover { text-decoration: underline; }
      `}</style>

      <div className="login-page">
        <div className="login-card">
          <div className="brand">
             <MapPin size={20} color="#f2a93b" strokeWidth={2.5} />
            <span>Nirapod Elaka</span>
          </div>

          <h1 className="login-title">Welcome back</h1>
          <p className="subtitle">Log in to check your area's safety status.</p>

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label" htmlFor="email">
                Email
              </label>
              <div className="field-wrap">
                <input
                  type="email"
                  id="email"
                  placeholder="you@domain.com"
                  required
                  className="custom-input"
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <div className="field-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Your password"
                  required
                  className="custom-input"
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="row-between">
              <a href="#" className="forgot-link">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn-custom-primary">
              Log in
            </button>
          </form>

          <div className="signup-prompt">
            Don't have an account?{" "}
            <a href="/register" className="signup-link">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
