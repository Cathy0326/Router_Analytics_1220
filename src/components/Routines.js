import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { createContext, useContext } from "react"; // Add this line
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import "./Routines.css";

// create the ActivityContext
const ActivityContext = createContext();

// custom hook to use the activity context
export const useActivity = () => useContext(ActivityContext);

function Routines() {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0);
  const [name, setName] = useState("");
  // const [list, setList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSelected, setIsSelected] = useState(false);
  const [feeling, setFeeling] = useState("");
  // Default sorting by duration ascending
  const [sortOrder, setSortOrder] = useState("durationAsc");
  const navigate = useNavigate();

  // Use the activity context
  const { activities, setActivities } = useActivity();

  // Sync activities with the local list state
  const [list, setList] = useState(activities);
  useEffect(() => {
    // Sync the local list with the activities context
    setList(activities);
  }, [activities]);

  //time duration logic
  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused) {
      interval = setInterval(() => setTime((prev) => prev + 1000), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  const start = () => {
    setIsPaused(false);
  };

  const stop = () => {
    setIsPaused(true);
    addItem();
  };

  //modify the list into a query string and pass it to the Analytics page.
  const handleAnalytics = () => {
    //check whether it has data input
    if (list.length === 0) {
      console.warn("No activities to pass to Analytics!");
      return alert("Please add activities before navigating to Analytics.");
    }
    const queryString = new URLSearchParams({
      data: JSON.stringify(list),
    }).toString();
    console.log("Query String:", queryString); // Debugging
    // Directly pass data as state when navigating
    navigate(`/analytics?${queryString}`);
  };

  const togglePlayPause = () => {
    if (isPaused) setIsActive(true);
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(true);
    setTime(0);
  };

  // datepicker, refer to CS385 slides
  const handleDateChange = (theDate) => {
    setIsSelected(true);
    setSelectedDate(theDate);
  };

  // check if the selected date is in the future, refer to CS385 slides
  const isFuture = () => {
    return selectedDate > new Date();
  };

  // console.log("Updated Activity List:", list); //debugging

  // add activity to the list
  const addItem = () => {
    // validate all fields except the date
    if (!name || time <= 0 || !feeling) {
      return alert("Please complete all fields.");
    }
    // if (!name) return alert("Enter a valid activity name.");
    // if (time <= 0) return alert("Run the timer before adding an item.");
    // if (!feeling) return alert("Please select a feeling.");
    // if (!isSelected) return alert("Please choose a date.");

    // If no new date is selected, use the default date (current date)
    const activityDate = selectedDate || new Date();

    // Add the activity to the list
    setActivities((prevActivities) => [
      ...prevActivities,
      { name, duration: Math.floor(time / 1000), date: activityDate, feeling },
    ]);

    // reset input
    setName("");
    setTime(0);
    setIsSelected(false); // Reset date selection for the next entry
    setFeeling("");
  };

  // Remove activity function
  const removeActivity = (index) => {
    const updatedActivities = list.filter((_, idx) => idx !== index);
    setActivities(updatedActivities);
  };

  // Mapping of sort options to comparison functions
  const sortFunctions = {
    asc: (a, b) => a.duration - b.duration,
    desc: (a, b) => b.duration - a.duration,
    "name-asc": (a, b) => a.name.localeCompare(b.name),
    "name-desc": (a, b) => b.name.localeCompare(a.name),
    "date-asc": (a, b) => new Date(a.date) - new Date(b.date),
    "date-desc": (a, b) => new Date(b.date) - new Date(a.date),
  };

  // Function to handle sorting based on the current sortOrder
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  return (
    <div className="card-container">
      <div className="container">
        <form>
          <p>Please choose a date:</p>
          <div className="form-group">
            <DatePicker
              dateFormat="MMMM d, yyyy"
              closeOnScroll={true}
              selected={selectedDate}
              onChange={handleDateChange}
            />
          </div>
        </form>
        {isSelected && (
          <p>
            You have chosen: {selectedDate.toString()}
            {isFuture() && <span> (This date is in the future)</span>}
          </p>
        )}
        <p>
          Year: {selectedDate.getFullYear()}, Month:{" "}
          {selectedDate.getMonth() + 1}, Day: {selectedDate.getDate()}
        </p>
      </div>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter activity name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select value={feeling} onChange={(e) => setFeeling(e.target.value)}>
          <option value="" disabled>
            Select Feeling
          </option>
          <option value="Happy">😊 Happy</option>
          <option value="Excited">😄 Excited</option>
          <option value="Surprise">😲 Surprise</option>
          <option value="Calm">😌 Calm</option>
          <option value="Angry">😡 Angry</option>
          <option value="Sad">😢 Sad</option>
          <option value="Depressed">😞 Depressed</option>
        </select>

        <button onClick={addItem} disabled={time <= 0 || !name || !feeling}>
          Add Activity
        </button>
      </div>

      {/* Sorting */}
      <select onChange={handleSortChange} value={sortOrder}>
        <option value=" ">Sorting </option>
        <option value="asc">Sort by Duration (Asc)</option>
        <option value="desc">Sort by Duration (Desc)</option>
        <option value="name-asc">Sort by Name (A-Z)</option>
        <option value="name-desc">Sort by Name (Z-A)</option>
        <option value="date-asc">Sort by Date (Earliest)</option>
        <option value="date-desc">Sort by Date (Latest)</option>
      </select>

      <div className="list-section">
        <h3> Added Activities </h3>
        <ul>
          {list.map((item, idx) => (
            <li key={idx}>
              <span>{item.name}</span>
              <span>{item.duration}s</span>
              <span>{item.date.toLocaleDateString()}</span>
              <span>Feeling: {item.feeling}</span>
              {/* remove activity */}
              <button onClick={() => removeActivity(idx)}>Delete</button>
            </li>
          ))}
        </ul>

        {/* render data on routines to analytics pages. /* Removed button, data is now passed directly 
        <button onClick={handleAnalytics}>Go to Analytics</button> */}
      </div>

      {/*  {/* Stop watch control 
      reference https://www.geeksforgeeks.org/create-a-stop-watch-using-reactjs/ */}
      <div className="button-container">
        <div className="button-display">
          {Math.floor(time / 3600000)}h{Math.floor((time % 3600000) / 60000)}m
          {Math.floor((time % 60000) / 1000)}s
        </div>
        <div
          className={`button-status-icon ${
            isPaused ? "triangle-icon" : "square-icon"
          }`}
          onClick={togglePlayPause}
        >
          {isPaused ? (
            <div className="button-play-icon"></div>
          ) : (
            <div className="button-inner-square"></div>
          )}
        </div>
        <button onClick={resetTimer} className="button-reset">
          Reset
        </button>
      </div>
    </div>
  );
}

// ActivityProvider component to wrap the app or required components
export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  return (
    <ActivityContext.Provider value={{ activities, setActivities }}>
      {children}
    </ActivityContext.Provider>
  );
};

export default Routines;
