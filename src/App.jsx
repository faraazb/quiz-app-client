import { Header } from "./components";
import "./App.css";
import { Outlet } from "react-router-dom";
import { QuizProvider } from "./contexts/CreateQuizContexts";
import AddQuestion from "./components/AddQuestion";

function App() {
    return (
        <div className="app">
            <Header />
            <main>
                <QuizProvider>
                    <AddQuestion />
                </QuizProvider>
                <Outlet />
            </main>
        </div>
    );
}
export default App;
