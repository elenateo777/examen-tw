import JobPostingEditor from "./JobPostingEditor";
import { Routes, Route, HashRouter } from "react-router-dom";

function App() {
    return(
        <div>
            <HashRouter>
                <Routes>
                    <Route
                     path="/"
                     element={<JobPostingEditor/>}
                   />
              </Routes>
            </HashRouter>
        </div>
    );
}

export default App;