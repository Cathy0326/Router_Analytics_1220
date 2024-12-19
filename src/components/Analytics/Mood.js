import React, { useState, useContext } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ActivitiesContext } from "./Analytics";
import { useActivity } from "../Routines"; // Import the useActivity hook

const Mood = () => {
  // Access activities via context
  const { activities } = useActivity();
  const [selectedMood, setSelectedMood] = useState(""); // For mood filtering
  // const activities = useContext(ActivitiesContext);

  // check if activities are available for analysis
  if (!activities.length) {
    return <div>No mood data available for analytics.</div>;
  }

  // calculate different feelings
  const moodCounts = activities.reduce((acc, activity) => {
    // Increment the count for each mood type
    acc[activity.feeling] = (acc[activity.feeling] || 0) + 1;
    return acc;
  }, {});

  // Filter moods based on selected mood
  const filteredMoodCounts = selectedMood
    ? { [selectedMood]: moodCounts[selectedMood] }
    : moodCounts;

  // convert moodCounts object into an array format suitable for the Pie chart
  const moodData = Object.entries(moodCounts).map(([mood, count]) => ({
    mood, // feeling type (e.g., happy, sad, etc.)
    count, // count of how many times this feeling occurred
  }));

  // define chart colors
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div>
      <h3>Mood Charts</h3>

      {/* Filter Dropdown for Mood */}
      <select
        onChange={(e) => setSelectedMood(e.target.value)}
        value={selectedMood}
      >
        <option value="">All Moods</option>
        {Object.keys(moodCounts).map((mood) => (
          <option key={mood} value={mood}>
            {mood}
          </option>
        ))}
      </select>

      {/* Display the mood counts in a list */}
      <ul>
        {Object.entries(moodCounts).map(([mood, count]) => (
          <li key={mood}>
            {mood}: {count}
          </li>
        ))}
      </ul>

      {/* Pie chart visualization */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          {/* The Pie chart needs data, and we pass moodData here */}
          <Pie
            data={moodData} // Pass mood data to Pie component
            dataKey="count" // Specify the key representing the value for each slice
            nameKey="mood" // Specify the key representing the label for each slice
            outerRadius={100} // Radius of the pie chart
            fill="#8884d8" // Default fill color
            label // Optionally display labels inside the slices
          >
            {/* Color each slice differently */}
            {moodData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          {/* Tooltip to display details on hover */}
          <Tooltip />
          {/* Legend to show the mood names */}
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Mood;
