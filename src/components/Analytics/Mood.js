import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useActivity } from "../Routines";

const Mood = () => {
  const { activities } = useActivity();
  const [filterType, setFilterType] = useState("mood"); // 'mood' or 'activity'
  const [selectedFilter, setSelectedFilter] = useState(""); // Selected mood or activity
  const [timePeriod, setTimePeriod] = useState("all"); // All, this week, last month, etc.

  // Helper: Format dates consistently
  const formatDate = (date) => {
    if (typeof date === "string") return date;
    return new Date(date).toISOString().split("T")[0];
  };

  // Format activity data with consistent dates
  const formattedActivities = activities.map((activity) => ({
    ...activity,
    date: formatDate(activity.date),
  }));

  // Calculate mood counts
  const moodCounts = formattedActivities.reduce((acc, activity) => {
    acc[activity.feeling] = (acc[activity.feeling] || 0) + 1;
    return acc;
  }, {});

  // Calculate activity counts for a selected mood
  const activityCountsByMood = (selectedMood) =>
    formattedActivities
      .filter((activity) => activity.feeling === selectedMood)
      .reduce((acc, activity) => {
        acc[activity.name] = (acc[activity.name] || 0) + 1;
        return acc;
      }, {});

  // Calculate mood counts for a selected activity
  const moodCountsByActivity = (selectedActivity) =>
    formattedActivities
      .filter((activity) => activity.name === selectedActivity)
      .reduce((acc, activity) => {
        acc[activity.feeling] = (acc[activity.feeling] || 0) + 1;
        return acc;
      }, {});

  // Get unique moods and activities
  const uniqueMoods = Array.from(
    new Set(formattedActivities.map((a) => a.feeling))
  );
  const uniqueActivities = Array.from(
    new Set(formattedActivities.map((a) => a.name))
  );

  // Data for pie chart
  const pieData = Object.entries(moodCounts).map(([mood, count]) => ({
    name: mood,
    value: count,
  }));

  // Data for bar chart based on selected filter
  const barData =
    filterType === "mood" && selectedFilter
      ? Object.entries(activityCountsByMood(selectedFilter)).map(
          ([name, count]) => ({
            name,
            count,
          })
        )
      : filterType === "activity" && selectedFilter
      ? Object.entries(moodCountsByActivity(selectedFilter)).map(
          ([name, count]) => ({
            name,
            count,
          })
        )
      : [];

  // Chart colors
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div>
      <h3>Mood and Activity Analytics</h3>

      {/* Filter Controls */}
      <div>
        <label htmlFor="filter-type">View by:</label>
        <select
          id="filter-type"
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setSelectedFilter(""); // Reset filter when changing type
          }}
        >
          <option value="mood">Mood</option>
          <option value="activity">Activity</option>
        </select>

        <label htmlFor="filter-value">Select:</label>
        <select
          id="filter-value"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value="">All</option>
          {(filterType === "mood" ? uniqueMoods : uniqueActivities).map(
            (item) => (
              <option key={item} value={item}>
                {item}
              </option>
            )
          )}
        </select>
      </div>

      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(1)}%`
            }
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Bar Chart */}
      {selectedFilter && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Mood;
