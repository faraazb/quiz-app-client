import { Outlet } from "react-router-dom";
import { Header } from "./components";
import "./App.css";
import { Outlet } from "react-router-dom";
import NavigationPane from "./components/NavigationPane";

function App() {
    return (
        <>
            <Header />
            <main>
                <NavigationPane />
                <Outlet />
            </main>
        </>
    );
}
export default App;
