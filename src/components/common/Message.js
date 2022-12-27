import React from "react";
import "../App.css";

const Message = ({ date, text, abbreviatedName, username }) => {
  return (
    <div className="Message">
      <div className="Message-profile-photo">{abbreviatedName}</div>
      <div>
        <div>
          <span className="Message-profile-name">{username}</span>
          <span className="Message-profile-time">{date}</span>
        </div>
        <div className="Message-text">{text}</div>
      </div>
    </div>
  );
};

export default Message;
