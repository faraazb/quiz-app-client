import "./index.css";
import { ReactComponent as QuizerellaLogo } from "../../assets/logo.svg";

export default function Header(props) {
    return (
        <header>
            <div className="logo">
                <QuizerellaLogo id="quizerella-logo" />
            </div>
        </header>
    );
}
