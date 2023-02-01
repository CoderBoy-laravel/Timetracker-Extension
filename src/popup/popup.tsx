import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import Api from "../extension/API/Api";
import DailyStandup from "../extension/DailyStandup/DailyStandup";
import Login from "../extension/Login/Login";
import "./popup.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import store from "../extension/store";
import { Provider } from "react-redux";
import WeekUpdate from "../extension/WeekUpdate/WeekUpdate";
const router = createBrowserRouter([
  {
    path: "/popup.html",
    element: <Login />,
  },
  {
    path: "/home",
    element: <DailyStandup />,
  },
  {
    path: "/week",
    element: <WeekUpdate />,
  },
]);

const root = document.createElement("div");
document.body.appendChild(root);
const app = ReactDOM.createRoot(document.querySelector("div") as HTMLElement);
app.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
