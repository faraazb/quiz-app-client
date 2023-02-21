import { Card, Button, InputNumber } from "antd";
import { useContext, useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

import ErrorMessage from "../ErrorMessage";
import OptionsCard from "../OptionsCard";
import { GetQuizHandlerContext } from "../../contexts/CreateQuizContexts";
import "./index.css";

const headingStyle = {
    border: "none",
};
const Question = (props) => {
    const { heading, data, defaultPoint } = props;
    const [errorMessage, setErrorMessage] = useState("");
    const [titleStatus, setTitleStatus] = useState("");
    const [question, setQuestion] = useState(data);
    const [cardClass, setCardClass] = useState("questionsCard");
    const { handleDeleteQuestion, handleUpdateQuestion } =
        GetQuizHandlerContext();
    useEffect(() => {
        //add error class to question card if errorMessage is given
        if (errorMessage) setCardClass("questionsCard error");
        else setCardClass("questionsCard");
    }, [errorMessage]);
    useEffect(() => {
        handleUpdateQuestion(question);
    }, [question]);
    //title text change handler
    const titleOnChangeHandler = (event) => {
        const {
            target: { value },
        } = event;
        //set error message if title not given
        if (value.length < 1) {
            setTitleStatus("error");
            setErrorMessage("Title should be given");
        } else {
            setTitleStatus("");
            setErrorMessage("");
        }
        setQuestion((oldQuestion) => {
            oldQuestion.title = value;
            return { ...oldQuestion };
        });
    };

    const pointOnChangeHandler = (points) => {
        setQuestion((oldQuestion) => {
            oldQuestion.points = points;
            return { ...oldQuestion };
        });
    };

    return (
        <Card
            title={heading || "Question"}
            headStyle={headingStyle}
            className={cardClass}
            extra={
                <Button
                    type="primary"
                    shape="circle"
                    icon={<DeleteOutlined />}
                    onClick={(event) => {
                        if (handleDeleteQuestion)
                            handleDeleteQuestion(question.id);
                    }}
                />
            }
        >
            <div className="inputContainer">
                <TextArea
                    className="title"
                    placeholder="Title"
                    allowClear={true}
                    autoSize
                    autoFocus
                    onChange={titleOnChangeHandler}
                    onBlur={titleOnChangeHandler}
                    status={titleStatus}
                    value={question.title}
                />
            </div>
            <div>
                <ErrorMessage errorMessage={errorMessage} />
            </div>
            <div className="pointContainer">
                <InputNumber
                    addonBefore=<label>Points</label>
                    type="number"
                    min={0}
                    value={question.points}
                    onChange={pointOnChangeHandler}
                />
                <Button
                    className="button"
                    type="primary"
                    onClick={pointOnChangeHandler}
                >
                    Reset
                </Button>
            </div>
            <OptionsCard />
        </Card>
    );
};
export default Question;
