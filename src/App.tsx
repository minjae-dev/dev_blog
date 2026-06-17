import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import "./App.css";
import Navbar from "./Components/Layout/Navbar";
import Footer from "./Components/Layout/Footer";
import Home from "./Pages/Home/Home";
import Posts from "./Pages/Posts/Posts";
import Post from "./Pages/Post/Post";
import Write from "./Pages/Write/Write";
import Login from "./Pages/Login/Login";
import GlobalStyle from "./Styles/global.styles";
import { ThemeProvider } from "./Context/ThemeContext";
import { RootState } from "./Stores/store-config";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
    return (
        <ThemeProvider>
            <GlobalStyle />
            <div className="App">
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/posts" element={<Posts />} />
                        <Route path="/post/:id" element={<Post />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/write"
                            element={
                                <PrivateRoute>
                                    <Write />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </main>
                <Footer />
            </div>
        </ThemeProvider>
    );
}

export default App;
