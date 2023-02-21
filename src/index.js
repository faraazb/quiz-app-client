import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/reset.css";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DashboardPage, StartQuizPage } from "./components";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/dashboard",
                element: <DashboardPage />,
            },
            {
                path: "/quiz/create",
            },
            {
                path: "/quiz/:quizId",
                element: <StartQuizPage />,
            },
            {
                path: "/quiz/:quizId/submissions",
            },
            {
                path: "/quiz/:quizId/submissions/:submissionId",
            },
        ],
    },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
