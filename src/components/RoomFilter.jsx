import React from 'react';

const RoomFilter = ({ rooms, selectedRoom, onRoomChange }) => {
  return (
    <div className="room-filter-container">
      <select 
        className="room-filter-select"
        value={selectedRoom || 'ALL'}
        onChange={(e) => onRoomChange(e.target.value === 'ALL' ? null : e.target.value)}
      >
        <option value="ALL">ALL ROOMS</option>
        {rooms.map(room => (
          <option key={room.id} value={room.id}>ROOM {room.id}</option>
        ))}
      </select>
    </div>
  );
};

export default RoomFilter;
