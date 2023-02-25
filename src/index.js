import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/reset.css";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DashboardPage, StartQuizPage, ResultPage } from "./components";

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
                element: <ResultPage />,
            },
        ],
    },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
