import { Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import About from "./pages/about/About";
import FeaturesPage from "./pages/features/FeaturesPage";
import Use_Cases from "./pages/use_cases/Use_Cases";
import Pricing from "./pages/pricing/Pricing";
import Login from "./auth/login/Login";
import Signup from "./auth/signup/Signup";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/use-cases" element={<Use_Cases />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
