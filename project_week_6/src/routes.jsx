import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
// import AuthLayout from "./layouts/AuthLayout";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Home from "./Components/Home";
import Explore from "./Components/Explore";
import Search from "./Components/Search";
import Place from "./Components/Place";
import AuthLayout from "./layouts/AuthLayout";

// import MyBookings from "../Components/Events/MyBookings";

export default function ROUTES() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/explore" element={<Explore />} />
        <Route exact path="/search" element={<Search />} />
        <Route exact path="/place/:id" element={<Place />} />
      </Route>

      {/* <Route path="/" element={<AuthLayout />}> */}
      <Route
        exact
        path="/login"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />
      <Route
        exact
        path="/register"
        element={
          <AuthLayout>
            <Register />
          </AuthLayout>
        }
      />
      {/* </Route> */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
