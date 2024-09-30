import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Calendar.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Calendar = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDate = new Date().getDate();

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [selectedDate, setSelectedDate] = useState(null);
  const [reminders, setReminders] = useState(
    JSON.parse(localStorage.getItem("reminders")) || []
  );
  const [isAddingReminder, setIsAddingReminder] = useState(false);

  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateDates = () => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = new Date(year, month, 1).getDay();
    const dates = [];

    for (let i = 0; i < firstDay; i++) {
      dates.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(day);
    }

    return dates;
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleDateClick = (date) => {
    if (date !== null) {
      setSelectedDate(new Date(year, month, date));
      displayRemindersForDate(date);
    }
  };

  const displayRemindersForDate = (date) => {
    const remindersForDate = reminders.filter(
      (reminder) =>
        reminder.date === date && reminder.month === month && reminder.year === year
    );
    if (remindersForDate.length > 0) {
      alert(
        `Reminders for ${date}/${month + 1}/${year}:\n\n${remindersForDate
          .map((reminder) => `${reminder.title}: ${reminder.description}`)
          .join("\n")}`
      );
    } else {
      alert(`No reminders for ${date}/${month + 1}/${year}`);
    }
  };

  const addReminder = () => {
    const title = prompt("Enter reminder title:");
    const description = prompt("Enter reminder description:");
    if (title && description && selectedDate) {
      const newReminder = {
        date: selectedDate.getDate(),
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
        title: title,
        description: description,
      };
      setReminders([...reminders, newReminder]);
      setSelectedDate(null);
      setIsAddingReminder(false);
    }
  };

  const deleteReminder = (index) => {
    const updatedReminders = reminders.filter((_, i) => i !== index);
    setReminders(updatedReminders);
  };

  const editReminder = (index) => {
    const title = prompt("Enter new reminder title:");
    const description = prompt("Enter new reminder description:");
    if (title && description) {
      const updatedReminders = reminders.map((reminder, i) =>
        i === index ? { ...reminder, title, description } : reminder
      );
      setReminders(updatedReminders);
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <header> <h1>Calendar & Reminders</h1> </header>

      <div className="calendar-wrapper">
        <div className="calendar-container">
          <div className="calendar-nav">
            <button onClick={prevMonth} className="arrow-btn">
              <FaArrowLeft />
            </button>
            <h2>
              {months[month]} {year}
            </h2>
            <button onClick={nextMonth} className="arrow-btn">
              <FaArrowRight />
            </button>
          </div>
          <div className="calendar">
            {daysOfWeek.map((day) => (
              <div key={day} className="day">
                {day}
              </div>
            ))}
            {generateDates().map((date, index) => (
              <div
                key={index}
                className={`date ${date !== null ? "active" : "inactive"} ${date === currentDate && month === currentMonth && year === currentYear
                    ? "current"
                    : ""
                  }`}
                onClick={() => handleDateClick(date)}
              >
                {date}
              </div>
            ))}
          </div>
        </div>
        {isAddingReminder && (
          <div className="add-reminder-modal">
            <h3>Select a Date for Reminder</h3>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />
            <button onClick={addReminder} className="add-reminder-btn">
              Add Reminder
            </button>
            <button
              onClick={() => setIsAddingReminder(false)}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        )}
        {!isAddingReminder && (
          <button onClick={() => setIsAddingReminder(true)} className="add-reminder-btn">
            Add Reminder
          </button>
        )}
      </div>
      <div className="reminder-container">
        <h3>Reminders</h3>
        <ul>
          {reminders.map((reminder, index) => (
            <li key={index}>
              <strong>Date:</strong> {reminder.date}/{reminder.month + 1}/{reminder.year}
              <br />
              <strong>Title:</strong> {reminder.title}
              <br />
              <strong>Description:</strong> {reminder.description}
              <br />
              <button onClick={() => editReminder(index)}>Edit</button>
              <button onClick={() => deleteReminder(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="footer">
        <p>
          Made By: <b>Dwija Panchal</b>
        </p>
        <p>
          Roll Number: <b>21BCP333</b>
        </p>
      </div>
    </div>
  );
};

export default Calendar;
