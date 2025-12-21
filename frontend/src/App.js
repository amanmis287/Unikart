import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cafe from "./pages/Cafe";
import Library from "./pages/Library";
import Notes from "./pages/Notes";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import VendorCafe from "./pages/VendorCafe";
import VendorXerox from "./pages/VendorXerox";
import VendorLibrary from "./pages/VendorLibrary";
import Xerox from "./pages/Xerox";
import AddNote from "./pages/AddNote";
import AddEvent from "./pages/AddEvent";
import Footer from "./components/Footer";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/shop"
          element={
            <ProtectedRoute>
              <Shop />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cafe"
          element={
            <ProtectedRoute>
              <Cafe />
            </ProtectedRoute>
          }
        />
        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <Library />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />

        {/* Vendor-only routes */}
        <Route
          path="/vendor/cafe"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <VendorCafe />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/xerox"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <VendorXerox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/library"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <VendorLibrary />
            </ProtectedRoute>
          }
        />

        {/* Other routes */}
        <Route path="/xerox" element={<Xerox />} />
        <Route path="/add-note" element={<AddNote />} />
        <Route path="/add-event" element={<AddEvent />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
