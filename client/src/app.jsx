import { BrowserRouter, Routes, Route } from "react-router-dom";
import './app.css';

import Layout from "./layout";
import Dashboard from "./task/dashboard";
import StatusList from "./status/status-list";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/statusList" element={<StatusList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
