import { useState } from "react";
import Navbar from "./Components/Navbar/Navbar";
import GroupView from "./Components/GroupView/GroupView";

function App() {
  const [grouping, setGrouping] = useState(
    window.localStorage.getItem("groupBy") ?? "Status"
  );
  const [ordering, setOrdering] = useState(
    window.localStorage.getItem("orderBy") ?? "Priority"
  );

  const handleGrouping = (selectedOption) => {
    // Implement the logic you want when the dropdown option changes
    console.log("Selected option handleGrouping:", selectedOption);
    setGrouping(selectedOption);
    window.localStorage.setItem("groupBy", selectedOption);
  };

  const handleOrdering = (selectedOption) => {
    console.log("Selected option handleOrdering:", selectedOption);
    setOrdering(selectedOption);
    window.localStorage.setItem("orderBy", selectedOption);
  };

  return (
    <div className="App">
      <Navbar
        handleGrouping={handleGrouping}
        handleOrdering={handleOrdering}
        grouping={grouping}
        ordering={ordering}
      />
      <GroupView grouping={grouping} ordering={ordering} />
    </div>
  );
}

export default App;
