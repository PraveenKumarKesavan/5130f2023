import { Outlet } from "react-router-dom";
import NavBar from "../Components/NavBar";

const MainLayout = () => {
  return (
    <main>
      <NavBar />
      <div className="mt-[74px]">
        <Outlet />
      </div>
    </main>
  );
};

export default MainLayout;
