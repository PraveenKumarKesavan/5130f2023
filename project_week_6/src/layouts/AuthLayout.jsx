import { useContext, useEffect } from "react";
// import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
// import { AuthContext } from "../../context/AuthContext";
// import toast from "react-hot-toast";

// project imports
// import Customization from "../Customization";

// ==============================|| MINIMAL LAYOUT ||============================== //

// eslint-disable-next-line react/prop-types
const AuthLayout = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      //   toast.error("Please Login to Continue!");
      navigate("/");
    }
  }, [isAuthenticated]);

  return <>{children}</>;
};

export default AuthLayout;
