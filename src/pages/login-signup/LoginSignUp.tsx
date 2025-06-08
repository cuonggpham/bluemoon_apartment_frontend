import "./LoginSignUp.css";
import { useState, useEffect } from "react";
import api from "../../services/axios";
import { AuthService } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Component LoginSignUp dùng để hiển thị các form đăng nhập và đăng ký
const LoginSignUp = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", username: "", password: "", confirm: "" });
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleToggle = (type: "login" | "register") => {
    setIsSignUpActive(type === "register");
  };

  const handleRememberChange = (e: any) => {
    setRemember(e.target.checked);
  };

  const handleSignUp = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    if (registerData.password !== registerData.confirm) {
      toast.error("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/users/register", {
        name: registerData.name,
        username: registerData.username,
        password: registerData.password,
      });

      if (response.status === 201) {
        localStorage.setItem("name", response.data.data.name);
        toast.success("Account created successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", {
        username: loginData.username,
        password: loginData.password,
      });

      const { accessToken, user } = response.data.data;

      if (remember) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("name", user.name);
        localStorage.setItem(
          "remember",
          JSON.stringify({ username: loginData.username, password: loginData.password })
        );
      } else {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("name", user.name);
      }

      navigate("/dashboard");
      toast.success("Welcome back!");
    } catch (error) {
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const url = await AuthService.authenticate("google");
      window.location.href = url;
    } catch (error: any) {
      toast.error("Google authentication failed");
      console.error("Lỗi xác thực với Google: ", error?.response?.data?.message || "");
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterInputChange = (e: any) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const rememberedData = localStorage.getItem("remember");
    if (rememberedData) {
      try {
        const parsed = JSON.parse(rememberedData);
        setLoginData(parsed);
        setRemember(true);
      } catch (error) {
        console.error("Error parsing remembered data");
      }
    }
  }, []);

  return (
    <div className="modern-auth-page">
      {/* Background */}
      <div className="auth-background">
        <div className="background-gradient"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="auth-nav">
        <div className="nav-content">
          <a href="/" className="nav-logo">
            <span className="logo-text">BlueMoon</span>
          </a>
          <a href="/" className="back-home">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5m7-7l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Home
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="auth-container">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <h1 className="auth-title">
              {isSignUpActive ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="auth-subtitle">
              {isSignUpActive 
                ? "Join BlueMoon to manage your property efficiently" 
                : "Sign in to your BlueMoon account"
              }
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="auth-toggle">
            <button 
              className={`toggle-btn ${!isSignUpActive ? 'active' : ''}`}
              onClick={() => handleToggle("login")}
            >
              Sign In
            </button>
            <button 
              className={`toggle-btn ${isSignUpActive ? 'active' : ''}`}
              onClick={() => handleToggle("register")}
            >
              Sign Up
            </button>
            <div className={`toggle-indicator ${isSignUpActive ? 'right' : 'left'}`}></div>
          </div>

          {/* Forms */}
          <div className="auth-forms">
            {/* Login Form */}
            <div className={`auth-form ${!isSignUpActive ? 'active' : ''}`}>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="login-username">Email or Username</label>
                  <input
                    id="login-username"
                    type="text"
                    name="username"
                    value={loginData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your email or username"
                    autoComplete="username"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="login-password">Password</label>
                  <input
                    id="login-password"
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                </div>

                <div className="form-options">
                  <label className="checkbox-container">
                    <input 
                      type="checkbox" 
                      checked={remember} 
                      onChange={handleRememberChange}
                    />
                    <span className="checkmark"></span>
                    Remember me
                  </label>
                  <a href="#" className="forgot-password">Forgot password?</a>
                </div>

                <button type="submit" className="primary-btn" disabled={isLoading}>
                  {isLoading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <>
                      Sign In
                      <svg className="btn-arrow" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>

                <div className="divider">
                  <span>or</span>
                </div>

                <button type="button" onClick={loginWithGoogle} className="google-btn">
                  <svg width="20" height="20" viewBox="0 0 256 262">
                    <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"/>
                    <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"/>
                    <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"/>
                    <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"/>
                  </svg>
                  Continue with Google
                </button>
              </form>
            </div>

            {/* Register Form */}
            <div className={`auth-form ${isSignUpActive ? 'active' : ''}`}>
              <form onSubmit={handleSignUp}>
                <div className="form-group">
                  <label htmlFor="register-name">Full Name</label>
                  <input
                    id="register-name"
                    type="text"
                    name="name"
                    value={registerData.name}
                    onChange={handleRegisterInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="register-email">Email Address</label>
                  <input
                    id="register-email"
                    type="email"
                    name="username"
                    value={registerData.username}
                    onChange={handleRegisterInputChange}
                    placeholder="Enter your email address"
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="register-password">Password</label>
                  <input
                    id="register-password"
                    type="password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterInputChange}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="register-confirm">Confirm Password</label>
                  <input
                    id="register-confirm"
                    type="password"
                    name="confirm"
                    value={registerData.confirm}
                    onChange={handleRegisterInputChange}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    required
                  />
                </div>

                <button type="submit" className="primary-btn" disabled={isLoading}>
                  {isLoading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <>
                      Create Account
                      <svg className="btn-arrow" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>

                <div className="divider">
                  <span>or</span>
                </div>

                <button type="button" onClick={loginWithGoogle} className="google-btn">
                  <svg width="20" height="20" viewBox="0 0 256 262">
                    <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"/>
                    <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"/>
                    <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"/>
                    <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"/>
                  </svg>
                  Sign up with Google
                </button>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="auth-footer">
            <p>
              By continuing, you agree to our{" "}
              <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
