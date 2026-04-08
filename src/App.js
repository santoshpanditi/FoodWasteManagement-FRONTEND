import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./Login";
import Dashboard from "./Dashboard";
import ListFood from "./ListFood";
import MyListings from "./MyListings";
import BrowseFood from "./BrowseFood";
import MyClaims from "./MyClaims";
import Impact from "./Impact";
import Deliveries from "./Deliveries";
import Users from "./Users";
import Moderation from "./Moderation";
import SystemReports from "./SystemReports";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/list-food" element={<ListFood />} />
      <Route path="/my-listings" element={<MyListings />} />
      <Route path="/browse-food" element={<BrowseFood />} />
      <Route path="/my-claims" element={<MyClaims />} />
      <Route path="/impact" element={<Impact />} />
      <Route path="/deliveries" element={<Deliveries />} />
      <Route path="/users" element={<Users />} />
      <Route path="/moderation" element={<Moderation />} />
      <Route path="/system-reports" element={<SystemReports />} />
    </Routes>
  );
}

export default App;