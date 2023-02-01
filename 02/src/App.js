import { Routes, Route } from "react-router-dom";
import "./App.scss";
import Video from "./common/Video";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Video />} />
            </Routes>
        </div>
    );
}

export default App;
