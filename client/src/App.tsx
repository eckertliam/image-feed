import React from "react";
import ReactDOM from "react-dom";
import { createBrowserRouter, Routes, Route, BrowserRouter } from "react-router-dom";
import MakePost from "./containers/MakePost";
import Feed from "./containers/Feed";

export default function App(): JSX.Element {
  return (
    <div className="app">
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Feed />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/make-post" element={<MakePost />} />
            </Routes>
        </BrowserRouter>
    </div>
  );
}
