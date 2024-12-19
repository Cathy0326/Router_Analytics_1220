import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { ActivityProvider } from "./components/Routines"; // Import ActivityProvider
import Home from "./components/Home";
import Routines from "./components/Routines";
import Analytics from "./components/Analytics/Analytics";
import Mood from "./components/Analytics/Mood";
import Activity from "./components/Analytics/Activity";
import Settings from "./components/Settings";

function App() {
  return (
    <Router>
      <ActivityProvider>
        {/* Navigation bar */}
        <nav style={styles.navBar}>
          <Link to="/" style={styles.link}>
            Home
          </Link>
          <Link to="/routines" style={styles.link}>
            Routines
          </Link>
          <Link to="/analytics" style={styles.link}>
            Analytics
          </Link>
          <Link to="/settings" style={styles.link}>
            Settings
          </Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/routines" element={<Routines />} />
          <Route path="/analytics" element={<Analytics />}>
            <Route index element={<Navigate to="mood" replace />} />{" "}
            {/* Default child route */}
            <Route path="mood" element={<Mood />} />
            <Route path="activity" element={<Activity />} />
          </Route>
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </ActivityProvider>
    </Router>
  );
}

/* quote style  */
const styles = {
  navBar: {
    display: "flex",
    justifyContent: "space-around",
    padding: "10px",
    background: "#333",
    color: "white",
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontSize: "18px",
  },
};

export default App;
