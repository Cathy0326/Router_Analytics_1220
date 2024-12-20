//import Outlet so child routes can be rendered to parent page analytics.
import { Link, Outlet, useLocation, useSearchParams } from "react-router-dom";
//pass the activities prop to Mood and Activity via context
import React, { createContext, useEffect, useState } from "react";
import Mood from "./Mood";
import Activity from "./Activity";

// create a Context for activities
export const ActivitiesContext = createContext();

const Analytics = () => {
  const location = useLocation();
  //const query = new URLSearchParams(location.search);
  //const activities = JSON.parse(query.get("data")) || [];
  // const activities = useContext(ActivitiesContext);
  const [activities, setActivities] = useState([]);

  {
    /* utilizes the useSearchParams hook from React Router 
   to retrieve and manipulate the query parameters of the current URL.*/
  }
  const [searchParams] = useSearchParams();

  // fetch data from query string
  useEffect(() => {
    // to check if data is passed via state
    if (location.state && location.state.activities) {
      setActivities(location.state.activities);
    }

    // or if data is passed via query parameters
    else if (searchParams.get("data")) {
      const data = JSON.parse(searchParams.get("data"));
      setActivities(data);
    }
  }, [location.state, searchParams]);

  return (
    <ActivitiesContext.Provider value={activities}>
      <div>
        <h2> Canva of Time and Emotions </h2>
        {/* Add local navigation for child routes */}
        <nav>
          <Link to="activity" style={{ marginRight: "10px" }}>
            Activity Reviews
          </Link>
          <Link to="mood">Mood Charts</Link>
        </nav>
        <Outlet /> {/* Render Mood or Activity on route */}
      </div>
    </ActivitiesContext.Provider>
  );
};

export default Analytics;
