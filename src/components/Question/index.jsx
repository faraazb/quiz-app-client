import { Card, Button, InputNumber } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

import ErrorMessage from "../ErrorMessage";
import OptionsCard from "../OptionsCard";
import "./index.css";
import { useEffect, useState } from "react";

const headingStyle = {
    border: "none",
};
const Question = (props) => {
    const { heading, removeOnClickHandler, parentKey, defaultPoint } = props;
    const [questionPoint, setQuestionPoint] = useState(defaultPoint || 0);
    const [errorMessage, setErrorMessage] = useState("");
    const [titleStatus, setTitleStatus] = useState("");
    const [cardClass, setCardClass] = useState("questionsCard");

    useEffect(() => {
        //add error class to question card if errorMessage is given
        if (errorMessage) setCardClass("questionsCard error");
        else setCardClass("questionsCard");
    }, [errorMessage]);

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
                        if (removeOnClickHandler)
                            removeOnClickHandler(event, parentKey);
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
                    value={questionPoint}
                    onChange={setQuestionPoint}
                />
                <Button
                    className="button"
                    type="primary"
                    onClick={() => {
                        setQuestionPoint(defaultPoint || 0);
                    }}
                >
                    Reset
                </Button>
            </div>
            <OptionsCard />
        </Card>
    );
};
export default Question;
