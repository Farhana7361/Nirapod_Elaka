import React, { useState } from "react";

import { 
  User, Lock, MapPin, Check,CircleCheck} from "lucide-react";

import "./Signup.css";

export default function Signup() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState("fwd");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    identity: "",
    password: "",
    confirmPassword: "",
    area: "",
    terms: false,
  });

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === "checkbox" ? checked : value;

  
    if (name === "identity") {
      val = val.replace(/\D/g, "");
    }

    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const validate = () => {
    if (step === 0) {
      const validLengths = [10, 13, 17];
      return (
        formData.name &&
        formData.email.includes("@") &&
        validLengths.includes(formData.identity.length)
      );
    }
    if (step === 1) {
      return (
        formData.password.length >= 8 &&
        formData.password === formData.confirmPassword
      );
    }
    if (step === 2) return formData.area.length > 0;
    if (step === 3) return formData.terms;
    return true;
  };

  const nextStep = () => {
    if (!validate()) {
      
      return;
    }
    if (step < 3) {
      setDirection("fwd");
      setStep(step + 1);
    } else {
      setIsSuccess(true);
    }
  };

  const prevStep = () => {
    setDirection("back");
    setStep(step - 1);
  };

  return (
    <div className="signup-wrapper">
      <main className="signup-card">
        <div className="signup-head">
          <div className="signup-wordmark">
             <MapPin size={20} color="#f2a93b" strokeWidth={2.5} />
            <span>Nirapod Elaka</span>
          </div>
        </div>

        {!isSuccess && (
          <div className="signup-stepper">
            <div className="signup-step-row">
              <div className={`signup-step-icon ${step >= 0 ? "active" : ""}`}>
                <User size={18} />
              </div>
              <div className="signup-step-track">
                <div className="signup-step-track-fill" style={{ width: step >= 1 ? "100%" : "0%" }}></div>
              </div>
              <div className={`signup-step-icon ${step >= 1 ? "active" : ""}`}>
                <Lock size={18} />
                 </div>
              <div className="signup-step-track">
                <div className="signup-step-track-fill" style={{ width: step >= 2 ? "100%" : "0%" }}></div>
              </div>
              <div className={`signup-step-icon ${step >= 2 ? "active" : ""}`}>
                <MapPin size={18} />
              </div>
              <div className="signup-step-track">
                <div className="signup-step-track-fill" style={{ width: step >= 3 ? "100%" : "0%" }}></div>
              </div>
              <div className={`signup-step-icon ${step >= 3 ? "active" : ""}`}>
                 <Check size={18} />
              </div>
            </div>
          </div>
        )}

        <div className="signup-panel-wrap">
          {isSuccess ? (
            <div className="signup-success">
              <div className="ring">
                 <CircleCheck size={95} />
                
              </div>
              <h2>You're on the map</h2>
            </div>
          ) : (
            <>
              {step === 0 && (
                <div className={`signup-step-panel enter-${direction}`}>
                  <div className="signup-step-title">Who you are</div>
                  <p className="signup-step-sub">Just for your login — never shown on a report.</p>
                  <div className="signup-field">
                    <label>Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInput} placeholder="Your name" />
                  </div>
                  <div className="signup-field">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInput} placeholder="you@domain.com" />
                  </div>
                  <div className="signup-field">
                    <label>NID or Birth Certificate</label>
                    <input type="text" name="identity" value={formData.identity} onChange={handleInput} placeholder=" " maxLength="10" />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className={`signup-step-panel enter-${direction}`}>
                  <div className="signup-step-title">Secure your account</div>
                  <p className="signup-step-sub">At least 8 characters.</p>
                  <div className="signup-field">
                    <label>Password</label>
                    <div className="signup-field-row">
                      <input type={showPass ? "text" : "password"} name="password" value={formData.password} onChange={handleInput} placeholder="••••••••" />
                      <button type="button" className="signup-toggle-visibility" onClick={() => setShowPass(!showPass)}>{showPass ? "Hide" : "Show"}</button>
                    </div>
                  </div>
                  <div className="signup-field">
                    <label>Confirm Password</label>
                    <div className="signup-field-row">
                      <input type={showPass2 ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleInput} placeholder="••••••••" />
                      <button type="button" className="signup-toggle-visibility" onClick={() => setShowPass2(!showPass2)}>{showPass2 ? "Hide" : "Show"}</button>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className={`signup-step-panel enter-${direction}`}>
                  <div className="signup-step-title">Your area</div>
                  <p className="signup-step-sub">We'll show this area first on your map.</p>
                  <div className="signup-field">
                    <label>Neighborhood</label>
                    <input type="text" name="area" value={formData.area} onChange={handleInput} placeholder="e.g. Dhanmondi, Dhaka" />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className={`signup-step-panel enter-${direction}`}>
                  <div className="signup-step-title">Confirm & create</div>
                  <div className="signup-summary">
                    <div className="signup-summary-row"><span className="signup-k">NAME</span><span>{formData.name}</span></div>
                    <div className="signup-summary-row"><span className="signup-k">EMAIL</span><span>{formData.email}</span></div>
                    <div className="signup-summary-row"><span className="signup-k">AREA</span><span>{formData.area}</span></div>
                  </div>
                  <div className="signup-note"><b>Reports stay anonymous.</b> This info only signs you in.</div>
                  <label className="signup-terms">
                    <input type="checkbox" name="terms" checked={formData.terms} onChange={handleInput} />
                    <span>I agree to guidelines and understand reports are anonymous.</span>
                  </label>
                </div>
              )}

              <div className="signup-bnav">
                {step > 0 && (
                  <button type="button" className="signup-btn signup-btn-back" onClick={prevStep}>Back</button>
                )}
                <button type="button" className={`signup-btn signup-btn-next ${step === 3 ? 'final' : ''}`} onClick={nextStep}>
                  {step === 3 ? "Create account" : "Continue"}
                </button>
              </div>

              {step === 0 && (
                <div className="signup-login-prompt">
                  Already have an account? <a href="/login" className="signup-login-link">Log in</a>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}


