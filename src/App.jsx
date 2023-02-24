import { Header, QuizCreationPage } from "./components";
import "./App.css";
import { Outlet } from "react-router-dom";
import { QuizProvider } from "./contexts/CreateQuizContexts";
function App() {
    return (
        <div className="app">
            <Header />
            <main>
                <Outlet />
                <QuizProvider>
                    <QuizCreationPage></QuizCreationPage>
                </QuizProvider>
            </main>
        </div>
    );
}
export default App;
