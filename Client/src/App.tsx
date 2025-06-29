import { Route, Routes } from "react-router-dom";
import SignUp from "./modules/Auth/views/SignUp";
import Home from "./modules/Home";
import Login from "./modules/Auth/views/Login";

export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </>
    )
}
