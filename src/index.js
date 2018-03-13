import React from "react";
import ReactDOM from "react-dom";
import "materialize-css"; // It installs the JS asset only
import "materialize-css/dist/css/materialize.min.css";
import "font-awesome/css/font-awesome.css";
import "animate.css";
import "./css/custom.css";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<App />, document.getElementById("main"));
registerServiceWorker();
