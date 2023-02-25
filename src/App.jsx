import { Header } from "./components";
import "./App.css";
import { Outlet } from "react-router-dom";
import NavigationPane from "./components/NavigationPane";
function App() {
    return (
        <div className="app">
            <Header />
            <main>
                <NavigationPane />
                <Outlet />
            </main>
        </div>
    );
}
export default App;
