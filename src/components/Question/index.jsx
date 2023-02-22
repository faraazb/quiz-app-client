import { Card, Button, InputNumber, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

import ErrorMessage from "../ErrorMessage";
import OptionsCard from "../OptionsCard";
import { GetQuizHandlerContext } from "../../contexts/CreateQuizContexts";
import "./index.css";

const headingStyle = {
    border: "none",
};
const removeToolTipText = "Remove question";

const Question = (props) => {
    const { heading, defaultPoints, data } = props;
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
            const newQuestion = structuredClone(oldQuestion);
            newQuestion.title = value;
            return newQuestion;
        });
    };

    const pointOnChangeHandler = (isReset, points) => {
        setQuestion((oldQuestion) => {
            const newQuestion = structuredClone(oldQuestion);
            if (isReset) newQuestion.isPointDefault = true;
            else newQuestion.isPointDefault = false;
            newQuestion.points = points;
            return newQuestion;
        });
    };

    return (
        <Card
            title={heading || "Question"}
            headStyle={headingStyle}
            className={cardClass}
            extra={
                <Tooltip placement="top" title={removeToolTipText}>
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<DeleteOutlined />}
                        onClick={(event) => {
                            if (handleDeleteQuestion)
                                handleDeleteQuestion(question.id);
                        }}
                    />
                </Tooltip>
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
                    onChange={(points) => {
                        pointOnChangeHandler(false, points);
                    }}
                />
                <Button
                    className="button"
                    type="primary"
                    onClick={(event) => {
                        pointOnChangeHandler(true, defaultPoints);
                    }}
                >
                    Reset
                </Button>
            </div>
            <OptionsCard parentKey={question.id} />
        </Card>
    );
};
export default Question;
