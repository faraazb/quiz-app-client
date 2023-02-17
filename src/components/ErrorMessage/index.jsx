import "./index.css";

const ErrorMessage = (props) => {
    const { className, errorMessage } = props;
    if (errorMessage)
        return (
            <h2 className={className + " errorMessageDefault"}>
                {errorMessage}
            </h2>
        );
    return <h2></h2>;
};

export default ErrorMessage;
