import React from "react";
import { createRoot } from "react-dom/client";
import Main from "./Main";

const App = createRoot(document.getElementById("root"));
App.render(<Main />);
