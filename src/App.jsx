import React from "react";
import AssemblyLine from "./components/AssemblyLine";

const App = () => (
  <div id="app">
    <AssemblyLine stages={["Idea", "Development", "Testing", "Deployment"]} />
  </div>
);

export default App;
