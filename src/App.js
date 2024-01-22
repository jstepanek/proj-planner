// App.js

import React, { useState, useEffect } from 'react';
import './App.css'; // Import your existing CSS file

const App = () => {
  // Function to format the date as "Sun, Jan 21"
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  // Get today's date
  const today = new Date();
  const initialDate = today.toISOString().split('T')[0];

  // Function to handle editing for each section
  const handleEdit = (setterFunction, date, index) => (event) => {
    const newValue = event.target.innerText;
    setterFunction(date, index, newValue);
  };

  // Function to render editable lines
  const renderEditableLines = (values, date, setterFunction) => (
    <>
      {values.map((value, index) => (
        <div
          key={index}
          className="editable-line"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleEdit(setterFunction, date, index)}
        >
          {value}
        </div>
      ))}
    </>
  );

  // State for to-do list
  const [todos, setTodos] = useState({});
  const handleEditTodo = (date, index, newValue) => {
    const updatedTodos = { ...todos, [date]: [...(todos[date] || Array(3).fill(''))] };
    updatedTodos[date][index] = newValue;
    setTodos(updatedTodos);
  };

  // State for top priorities
  const [priorities, setPriorities] = useState({});
  const handleEditPriority = (date, index, newValue) => {
    const updatedPriorities = { ...priorities, [date]: [...(priorities[date] || Array(3).fill(''))] };
    updatedPriorities[date][index] = newValue;
    setPriorities(updatedPriorities);
  };

  // State for personal goal
  const [personalGoal, setPersonalGoal] = useState('');

  // State for meal planner
  const [mealPlan, setMealPlan] = useState('');

  // State for the current date
  const [currentDate, setCurrentDate] = useState(initialDate);

  // State for dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Apply dark or light mode styles
  const appClass = darkMode ? 'dark-mode' : 'light-mode';

  // Load data from localStorage or set initial data
  const loadData = (date) => {
    const storedData = localStorage.getItem(date);
    if (storedData) {
      const { todos, priorities, personalGoal, mealPlan } = JSON.parse(storedData);
      setTodos(todos || {});
      setPriorities(priorities || {});
      setPersonalGoal(personalGoal || '');
      setMealPlan(mealPlan || '');
    }
  };

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(currentDate, JSON.stringify({ todos, priorities, personalGoal, mealPlan }));
  }, [currentDate, todos, priorities, personalGoal, mealPlan]);

  // Switch to the previous or next day
  const switchDay = (direction) => {
    const currentDateObj = new Date(currentDate);
    currentDateObj.setDate(currentDateObj.getDate() + direction);
    const newDate = currentDateObj.toISOString().split('T')[0];

    setCurrentDate(newDate);
    loadData(newDate); // Load data for the new date after updating the state
  };

  return (
    <div className={`daily-planner ${appClass}`}>
      {/* Dark/Light Mode Toggle Button */}
      <div className="mode-toggle">
        <button onClick={toggleDarkMode}>{darkMode ? 'Light Mode' : 'Dark Mode'}</button>
      </div>

      {/* Switch Day */}
      <div className="section">
        <h2>Switch Day</h2>
        <button onClick={() => switchDay(-1)}>Previous Day</button>
        <span>{formatDate(currentDate)}</span>
        <button onClick={() => switchDay(1)}>Next Day</button>
      </div>

      {/* To-Do List */}
      <div className="section">
        <h2><b>To-Do List</b></h2>
        {renderEditableLines(todos[currentDate] || Array(3).fill(''), currentDate, handleEditTodo)}
      </div>

      {/* Top Priorities */}
      <div className="section">
        <h2><b>Top Priorities</b></h2>
        {renderEditableLines(priorities[currentDate] || Array(3).fill(''), currentDate, handleEditPriority)}
      </div>

      {/* Personal Goal */}
      <div className="section">
        <h2><b>Personal Goal</b></h2>
        <div
          className="editable-line"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleEdit(setPersonalGoal, currentDate, null)}
        >
          {personalGoal}
        </div>
      </div>

      {/* Meal Planner */}
      <div className="section">
        <h2><b>Meal Planner</b></h2>
        <div
          className="editable-line"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleEdit(setMealPlan, currentDate, null)}
        >
          {mealPlan}
        </div>
      </div>
    </div>
  );
};

export default App;
