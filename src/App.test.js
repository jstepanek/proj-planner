// App.test.js

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import App from './App';

test('renders App component without crashing', () => {
  render(<App />);
  const appComponent = screen.getByTestId('app-component');
  expect(appComponent).toBeInTheDocument();
});

test('switches day on button click', () => {
  render(<App />);
  const nextDayButton = screen.getByText(/Next Day/i);
  fireEvent.click(nextDayButton);
  const currentDate = screen.getByText(/Sun, Jan 21/i); // Adjust the date based on your initial date
  expect(currentDate).toBeInTheDocument();
});

test('toggles dark/light mode on button click', () => {
  render(<App />);
  const toggleButton = screen.getByText(/Dark Mode/i);

  fireEvent.click(toggleButton);
  const appContainerDark = screen.getByTestId('app-component');
  expect(appContainerDark).toHaveClass('dark-mode');

  fireEvent.click(toggleButton);
  const appContainerLight = screen.getByTestId('app-component');
  expect(appContainerLight).toHaveClass('light-mode');
});

test('persists states when switching between days', () => {
  render(<App />);
  const nextDayButton = screen.getByText(/Next Day/i);

  // Update states on the current day
  fireEvent.click(screen.getByText(/To-Do List/i), { button: 0 });
  fireEvent.change(screen.getByText(/To-Do List/i), { target: { innerText: 'Task 1' } });
  fireEvent.click(screen.getByText(/Top Priorities/i), { button: 0 });
  fireEvent.change(screen.getByText(/Top Priorities/i), { target: { innerText: 'Priority 1' } });
  fireEvent.click(screen.getByText(/Personal Goal/i), { button: 0 });
  fireEvent.change(screen.getByText(/Personal Goal/i), { target: { innerText: 'My Goal' } });
  fireEvent.click(screen.getByText(/Meal Planner/i), { button: 0 });
  fireEvent.change(screen.getByText(/Meal Planner/i), { target: { innerText: 'Healthy Meal' } });

  // Switch to the next day
  fireEvent.click(nextDayButton);

  // Check if the updated states persist
  expect(screen.getByText('Task 1')).toBeInTheDocument();
  expect(screen.getByText('Priority 1')).toBeInTheDocument();
  expect(screen.getByText('My Goal')).toBeInTheDocument();
  expect(screen.getByText('Healthy Meal')).toBeInTheDocument();
});