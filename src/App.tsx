import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Layout/Navbar";
import Footer from "./Components/Layout/Footer";
import Home from "./Pages/Home/Home";
import Posts from "./Pages/Posts/Posts";
import Post from "./Pages/Post/Post";
import Write from "./Pages/Write/Write";
import GlobalStyle from "./Styles/global.styles";

function App() {
    return (
        <>
            <GlobalStyle />
            <div className="App">
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/posts" element={<Posts />} />
                        <Route path="/post/:id" element={<Post />} />
                        <Route path="/write" element={<Write />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </>
    );
}

export default App;
