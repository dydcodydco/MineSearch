import React from "react";
import { createRoot } from "react-dom/client";
import MineSearch from "./MineSearch";

const container = document.querySelector("#root");
const app = createRoot(container);
app.render(<MineSearch />);
