// components/Tabs.jsx
import React from "react";

const Tabs = ({ tabs, selectedTab, onTabChange }) => {
  return (
    <div className="flex justify-center space-x-4 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`flex items-center space-x-2 pb-2 text-lg font-medium border-b-2 transition-colors ${
            selectedTab === tab.value
              ? "border-red-700 text-red-700 dark:text-red-600"
              : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
          }`}
        >
          {tab.icon && <span>{tab.icon}</span>}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};


export default Tabs;
