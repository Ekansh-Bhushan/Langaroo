import { getAdmin } from "@/lib/auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const App = dynamic(() => import("./app"));

const AdminPage = async() => {
    const isAdmin = await getAdmin();

    if(!isAdmin) redirect("/")
  return <App />;
};

export default AdminPage;