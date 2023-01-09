import React from "react";
import "../App.css";

const Message = ({
  date,
  msgTime,
  text,
  abbreviatedName,
  username,
  classNameTag,
}) => {
  let dateOnly = new Date(date);

  if (classNameTag == "msg-with-dp") {
    return (
      <div className="Message">
        <div className="Message-profile-photo">{abbreviatedName}</div>
        <div>
          <div>
            <span className="Message-profile-name">{username}</span>
            <span className="Message-profile-time">
              {dateOnly.toLocaleTimeString("en-US")}
            </span>
          </div>
          <div className="Message-text">{text}</div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="Message">
        <div className="Message-no-profile-photo">
          <div className="Message-profile-time-hide">{msgTime}</div>
          <div className="Message-text">{text}</div>
        </div>
      </div>
    );
  }
};

export default Message;
