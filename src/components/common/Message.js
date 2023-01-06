import React from "react";
import "../App.css";

const Message = ({ date, text, abbreviatedName, username, classNameTag }) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  let dateOnly = new Date(date);

  if (classNameTag == "msg-with-date") {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <hr
          style={{
            width: "100%",
            borderWidth: "0.20px",
          }}
        />
        <div className=" Message-date">
          {dateOnly.toLocaleDateString("en-US", options)}
        </div>

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
      </div>
    );
  } else if (classNameTag == "msg-with-dp") {
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
          <span className="Message-profile-time-hide">
            {dateOnly.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span className="Message-text">{text}</span>
        </div>
      </div>
    );
  }
};

export default Message;
