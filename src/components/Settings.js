import React from "react";
import { useState, useEffect } from "react";
import Select from "react-select"; // Import react-select

// Load translations from the JSON file
import Translation from "./translation.json";

// A custom hook to handle language switching and providing translations
export const useI18n = () => {
  const [language, setLanguage] = useState("en");

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang); // Store the selected language
  };

  // Check for a saved language preference in localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Return the current translations based on the selected language
  const translate = (key) => {
    return (
      Translation.find((item) => item.language === language)?.translations[
        key
      ] || key
    );
  };

  return {
    language,
    changeLanguage,
    translate,
  };
};

const Settings = () => {
  const { language, changeLanguage, translate } = useI18n(); // Use the custom hook to get translations and change language

  // Define language options for the dropdown
  const languageOptions = [
    { value: " ", label: "Search" },
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "zh", label: "Chinese" },
    { value: "uk", label: "Ukrainian" },
    { value: "ga", label: "Irish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
    { value: "pl", label: "Polish" },
    { value: "ja", label: "Japanese" },
    { value: "ru", label: "Russian" },
    { value: "ar", label: "Arabic" },
  ];

  return (
    <div>
      <h2>{translate("title")}</h2>
      <p>{translate("description")}</p>
      <div>
        <label>{translate("language")}:</label>
        {/* Searchable dropdown with placeholder */}
        <Select
          options={languageOptions}
          value={languageOptions.find((option) => option.value === language)} // Set the currently selected language
          onChange={(selectedOption) => changeLanguage(selectedOption.value)} // Handle language change
          getOptionLabel={(e) => e.label} // Display language name
          getOptionValue={(e) => e.value} // Set the value to be saved
          isSearchable={true} // Enable search functionality
          placeholder={
            translate("select_language") || "Choose your preferred language"
          } // Placeholder text with hint
        />
      </div>
    </div>
  );
};

export default Settings;
