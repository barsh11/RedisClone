import React, { useState } from "react";
import "./CommandLine.css";
import Marker from "../components/Marker";

const CommandLine = (props) => {
  const [commandStr, setCommandStr] = useState("");
  const [readOnly, setReadOnly] = useState(false);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      props.onCommandSubmit(commandStr);
      setReadOnly(true);
    }
  };

  const handleChange = (event) => {
    setCommandStr(event.target.value);
  };

  return (
    <div className="commandLine">
      <Marker />
      <input
        type="text"
        className="userInput"
        value={commandStr}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        readOnly={readOnly}
      />
    </div>
  );
};

export default CommandLine;
