import React, { useState } from "react";
import "./CommandsController.css";
import CommandLine from "./CommandLine";
import parseCommand from "../utils/parseCommand";
import { updateStorage } from "../utils/storageManager";

const CommandsController = () => {
  const [commandsList, setList] = useState([]);
  const [responsesList, setResponsesList] = useState([]);

  const handleCommandSubmit = (commandStr) => {
    const commandsListCopy = commandsList.slice();
    commandsListCopy.push(commandStr);
    setList(commandsListCopy);
    const parsedCommand = parseCommand(commandStr);
    const responseStr = updateStorage(parsedCommand);
    const responsesListCopy = responsesList.slice();
    responsesListCopy.push(responseStr);
    setResponsesList(responsesListCopy);
  };

  const renderCommandsItem = (el, index) => (
    <li key={index}>
      <div className="responseLine">
        {responsesList[index] ? responsesList[index] : null}
      </div>
      <CommandLine onCommandSubmit={handleCommandSubmit} />
    </li>
  );

  return (
    <>
      <CommandLine onCommandSubmit={handleCommandSubmit} />
      <ul className="CommandsHistory">
        {commandsList.map((el, index) => renderCommandsItem(el, index))}
      </ul>
    </>
  );
};

export default CommandsController;
