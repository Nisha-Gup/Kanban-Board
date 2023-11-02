import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faCircleExclamation,
  faSignal,
  faPlus,
  faBook,
  faHourglass,
  faList,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

import "./GroupView.css"; // Import your CSS file for styling

function GroupView({ grouping, ordering }) {
  console.log("grouping, ordering", grouping, ordering);
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [order, setOrder] = useState("");
  const [groupBy, setGroupBy] = useState("");
  const priority = ["No priority", "Low", "Medium", "High", "Urgent"];
  const iconSet = {
    Backlog: faBook,
    "In progress": faHourglass,
    Todo: faList,
    Urgent: faCircleExclamation,
    High: faTriangleExclamation,
    Medium: faSignal,
    Low: faSignal,
    "No priority": faEllipsis,
  };

  const getData = async () => {
    let response = await fetch(
      "https://api.quicksell.co/v1/internal/frontend-assignment"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const jsonData = await response.json();
    console.log("Data fetched from API", jsonData);
    jsonData.tickets =
      ordering === "Title"
        ? jsonData.tickets.sort((a, b) => a.title.localeCompare(b.title))
        : jsonData.tickets.sort((a, b) => b.priority - a.priority);
    setTickets(jsonData.tickets);
    setUsers(jsonData.users);
    refresView(jsonData.tickets, grouping, ordering);
    // console.log("finalGroupData", finalGroupData);
  };

  function refresView(tickets, grouping, ordering) {
    if (!grouping || !ordering) return;
    tickets =
      ordering === "Title"
        ? tickets.sort((a, b) => a.title.localeCompare(b.title))
        : tickets.sort((a, b) => b.priority - a.priority);
    console.log("Inside refresView", grouping);
    const statusSet = new Set();
    // console.log("ticket[groupBy.toLowerCase()]", tickets[0][grouping.toLowerCase()], grouping)
    grouping.toLowerCase() !== "user"
      ? tickets.forEach((ticket) =>
          statusSet.add(ticket[grouping.toLowerCase()])
        )
      : tickets.forEach((ticket) => statusSet.add(ticket.userId));
    let finalGroupData = Array.from(statusSet);
    console.log("finalGroupData 1", finalGroupData);
    finalGroupData = finalGroupData.map((group) => {
      console.log("group", group);
      let data = {};
      data[group] =
        grouping.toLowerCase() !== "user"
          ? {
              tickets: tickets.filter(
                (ticket) => ticket[grouping.toLowerCase()] === group
              ),
              icon: "",
            }
          : {
              tickets: tickets.filter((ticket) => ticket.userId === group),
              icon: "",
            };
      return data;
    });
    finalGroupData = finalGroupData.sort((a, b) => {
      const keyA = Object.keys(a)[0]; // Get the parent key of object a
      const keyB = Object.keys(b)[0]; // Get the parent key of object b

      // Compare the parent keys to determine the sorting order
      return grouping != "Priority"
        ? keyA.localeCompare(keyB)
        : keyB.localeCompare(keyA);
    });
    console.log("finalGroupData", finalGroupData);
    setGroups(finalGroupData);
  }

  function getUserInitials(userId) {
    const fullName = users.filter((user) => user.id == userId)[0].name;
    const words = fullName.split(" ");

    // console.log("words", words);
    // Check if there's at least one word
    if (words.length > 1) {
      return `${words[0].substring(0, 1).toUpperCase()}${words[1]
        .substring(0, 1)
        .toUpperCase()}`;
    } else {
      return words[0].substring(0, 1);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log("Inside refresh data", grouping, ordering);
    setGroupBy(grouping);
    setOrder(ordering);
    setTickets(tickets);
    refresView(tickets, grouping, ordering);
  }, [grouping, ordering]);
  return (
    <div className="container">
      {groups.map((group) => (
        <div className="group" key={Object.keys(group)[0]}>
          {groupBy === "User" && (
            <div className="user">
              <div
                className={`avatar ${
                  users.filter((user) => user.id == Object.keys(group))[0]
                    .available
                    ? "online"
                    : "offline"
                }`}
                style={{ position: "absolute", marginTop: "5px", marginLeft: "20px" }}
              >
                <div className="status-dot"></div>
                <div className="circle">
                  {getUserInitials(Object.keys(group))}
                </div>
              </div>
            </div>
          )}
          <div className="group-name" style={{marginLeft: "40px"}}>
            <FontAwesomeIcon
              icon={
                iconSet[
                  groupBy === "Priority"
                    ? priority[Object.keys(group)]
                    : Object.keys(group)
                ]
              }
              className="icon-left"
            />
            {groupBy === "Priority"
              ? priority[Object.keys(group)]
              : groupBy === "User"
              ? users.filter((user) => user.id == Object.keys(group))[0].name
              : Object.keys(group)}
            &nbsp;&nbsp;{group[Object.keys(group)].tickets.length}
            <FontAwesomeIcon icon={faEllipsis} className="icon-right" />
            <FontAwesomeIcon icon={faPlus} className="icon-right" />
          </div>
          <div className="column">
            {group[Object.keys(group)].tickets.map((ticket) => (
              <div className="card" key={ticket.id}>
                <span className="card-id">{ticket.id}</span>
                {groupBy !== "User" && (
                  <div className="user">
                    <div
                      className={`avatar ${
                        users.filter((user) => user.id === ticket.userId)[0]
                          .available
                          ? "online"
                          : "offline"
                      }`}
                    >
                      <div className="status-dot"></div>
                      <div className="circle">
                        {getUserInitials(ticket.userId)}
                      </div>
                    </div>
                  </div>
                )}
                <p className="title">{ticket.title}</p>
                <div className="actions">
                  {/* {[1, 2, 3].map((tag) => ( */}
                  <button className="tag">{ticket.tag}</button>
                  {/* ))} */}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default GroupView;
