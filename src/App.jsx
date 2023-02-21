import { Header } from "./components";
import "./App.css";
import { Outlet } from "react-router-dom";
import { QuizState } from "./contexts/CreateQuizContexts";
import AddQuestion from "./components/AddQuestion";

function App() {
    return (
        <div className="app">
            <Header />
            <main>
                <QuizState>
                    <AddQuestion />
                </QuizState>
                <Outlet />
            </main>
        </div>
    );
}
export default App;
