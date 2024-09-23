import React from 'react';

const MakeReservation: React.FC = () => {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">Make a New Reservation</h3>
      <form className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="date" className="font-semibold">Select Date:</label>
          <input type="date" id="date" className="border border-gray-300 rounded-lg p-2" />
        </div>

        <div className="flex flex-col">
          <label htmlFor="time" className="font-semibold">Select Time:</label>
          <input type="time" id="time" className="border border-gray-300 rounded-lg p-2" />
        </div>

        <div className="flex flex-col">
          <label htmlFor="diningHall" className="font-semibold">Select Dining Hall:</label>
          <select id="diningHall" className="border border-gray-300 rounded-lg p-2">
            <option value="hall1">Dining Hall 1</option>
            <option value="hall2">Dining Hall 2</option>
            <option value="hall3">Dining Hall 3</option>
          </select>
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">
          Reserve Now
        </button>
      </form>
    </div>
  );
};

export default MakeReservation;
