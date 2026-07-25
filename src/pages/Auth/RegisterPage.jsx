// ================================================================
// REGISTER PAGE - Wrapper around Login with signup mode
// ================================================================
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage from "./LoginPage";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // LoginPage already handles both login and signup
  // We just render it and it will default to signup mode
  return <LoginPage />;
};

export default RegisterPage;
