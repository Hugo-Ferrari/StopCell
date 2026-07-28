
import Header from "@/components/Header";

import { Outlet } from "react-router-dom";

function MainLayout() {
    return (
        <div className="">
            <Header/>

            <main className="flex-1 p-5">
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;