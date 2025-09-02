import GeneratorPage from "../generator_page/GeneratorPage";
import Sidebar from "../sidebar/Sidebar";

export default function Layout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar/>
      <GeneratorPage/>
    </div>
  );
}
