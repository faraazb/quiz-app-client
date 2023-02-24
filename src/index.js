import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/reset.css";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DashboardPage, StartQuizPage, QuizCreationPage } from "./components";
import { QuizProvider } from "./contexts/CreateQuizContexts";

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
                element: <QuizProvider><QuizCreationPage/></QuizProvider>,
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
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
