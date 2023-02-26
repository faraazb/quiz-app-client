import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "antd/dist/reset.css";
import "./index.css";
import App from "./App";
import { TakeQuizProvider } from "./contexts/TakeQuizContext";
import { DashboardPage, TakeQuizPage, ResultPage, SubmissionsPage } from "./components";

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
                element: <TakeQuizProvider><TakeQuizPage /></TakeQuizProvider>,
            },
            {
                path: "/quiz/:quizId/submissions",
                element: <SubmissionsPage />
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
