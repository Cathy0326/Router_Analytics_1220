import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as LineTooltip,
  ResponsiveContainer,
} from "recharts";
import { useActivity } from "../Routines";

const Activity = () => {
  const { activities } = useActivity();
  const [timeRange, setTimeRange] = useState("alltime"); // Default to "All Time"
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [selectedActivity, setSelectedActivity] = useState("all");

  // Helper: Format dates
  const formatDate = (date) => {
    if (typeof date === "string") return date;
    return new Date(date).toISOString().split("T")[0];
  };

  // Ensure all activities have consistently formatted dates
  const activitiesWithFormattedDates = activities.map((activity) => ({
    ...activity,
    date: formatDate(activity.date),
  }));

  // Filter by time range
  const filterByTimeRange = (range) => {
    if (range === "alltime") return activitiesWithFormattedDates; // No filtering for "All Time"

    const now = new Date();
    let startDate, endDate;

    if (range === "thisweek") {
      const dayOfWeek = now.getDay();
      startDate = new Date(now);
      startDate.setDate(now.getDate() - dayOfWeek);
      endDate = new Date(now);
    } else if (range === "lastweek") {
      const dayOfWeek = now.getDay();
      endDate = new Date(now);
      endDate.setDate(now.getDate() - dayOfWeek - 1);
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 6);
    } else if (range === "thismonth") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = now;
    } else if (range === "lastmonth") {
      const lastMonth = now.getMonth() - 1;
      startDate = new Date(now.getFullYear(), lastMonth, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of last month
    } else if (range === "custom") {
      startDate = new Date(customRange.start);
      endDate = new Date(customRange.end);
    }

    return activitiesWithFormattedDates.filter((activity) => {
      const activityDate = new Date(activity.date);
      return activityDate >= startDate && activityDate <= endDate;
    });
  };

  // Filter by selected activity
  const filterByActivity = (filteredActivities) => {
    if (selectedActivity === "all") return filteredActivities;
    return filteredActivities.filter(
      (activity) => activity.name === selectedActivity
    );
  };

  // Filtered activities based on time range and activity
  const filteredActivities = filterByActivity(filterByTimeRange(timeRange));

  // Prepare data for chart
  const activityData = filteredActivities.map((item) => ({
    name: item.date, // Use date for the X-axis
    duration: item.duration,
  }));

  // Get unique activities for dropdown
  const uniqueActivities = Array.from(
    new Set(activitiesWithFormattedDates.map((activity) => activity.name))
  );

  return (
    <div>
      <h3>Activity Analysis</h3>

      {/* Time Range Filter */}
      <div className="filter-container">
        <label htmlFor="time-range-filter">Filter by Time Range:</label>
        <select
          id="time-range-filter"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="alltime">All Time</option>
          <option value="thisweek">This Week</option>
          <option value="lastweek">Last Week</option>
          <option value="thismonth">This Month</option>
          <option value="lastmonth">Last Month</option>
          <option value="custom">Custom Range</option>
        </select>

        {timeRange === "custom" && (
          <div className="custom-range">
            <label>
              Start Date:
              <input
                type="date"
                value={customRange.start}
                onChange={(e) =>
                  setCustomRange({ ...customRange, start: e.target.value })
                }
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                value={customRange.end}
                onChange={(e) =>
                  setCustomRange({ ...customRange, end: e.target.value })
                }
              />
            </label>
          </div>
        )}
      </div>

      {/* Activity Filter */}
      <div className="filter-container">
        <label htmlFor="activity-filter">Filter by Activity:</label>
        <select
          id="activity-filter"
          value={selectedActivity}
          onChange={(e) => setSelectedActivity(e.target.value)}
        >
          <option value="all">All Activities</option>
          {uniqueActivities.map((activity) => (
            <option key={activity} value={activity}>
              {activity}
            </option>
          ))}
        </select>
      </div>

      {/* LineChart Visualization */}
      {activityData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              label={{
                value: "Date",
                position: "insideBottom",
                dy: 10,
              }}
            />
            <YAxis
              label={{
                value: "Duration (mins)",
                angle: -90,
                position: "insideLeft",
                dy: -10,
              }}
            />
            <Line type="monotone" dataKey="duration" stroke="#82ca9d" />
            <LineTooltip />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>No activity data for the selected range or activity.</p>
      )}
    </div>
  );
};

export default Activity;
