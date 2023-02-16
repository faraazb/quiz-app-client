import styles from "./header.module.css";

export default function Header(props) {

    return (
        <header>
            <div className={styles.logo}>
                Quiz
            </div>
        </header>
    );
}
