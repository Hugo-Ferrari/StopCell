import Header from "@/components/common/Header";
import NavBar from "@/components/common/NavBar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="min-h-screen bg-background ">

      <NavBar />

      <div className="lg:ml-64">

        <Header />

        <main className="p-4 transition-all duration-300 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  );
}

export default MainLayout;