import { Header } from "./components";
import "./App.css";
import Question from "./components/Question";

function App() {
    return (
        <div className="app">
            <Header />
            <main>
                <Question />
            </main>
        </div>
    );
}
export default App;
