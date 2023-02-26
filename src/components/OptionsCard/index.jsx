import React, { useState } from "react";
import { Card, Button, Row, Col, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Option from "../Option";
import {
    GetQuizContext,
    GetQuizHandlerContext,
} from "../../contexts/CreateQuizContexts";
import "./index.css";

const addToolTipText = "Add option";

const OptionsCard = (props) => {
    const { parentKey } = props;
    const { quiz } = GetQuizContext();
    const { handleAddOption } = GetQuizHandlerContext();
    const [optionCount, setOptionCount] = useState(0);

    //Function to add a new option
    const addOptionClickHandler = () => {
        handleAddOption(parentKey);
    };
    const addOptions = () => {
        const question = quiz.questions.find(
            (question) => question._id === parentKey
        );
        if (optionCount !== question.options.length)
            setOptionCount(question.options.length);
        return question.options.map((option) => {
            return (
                <Option
                    key={option._id}
                    data={option}
                    questionKey={parentKey}
                />
            );
        });
    };
    const getOption = (option) => {
        return (
            <Col xs={22} sm={12} key={option.id}>
                <Option data={option} questionKey={parentKey} />
            </Col>
        );
    };
    return (
        <div className="optionContainer">
            <Card
                title={`Options (${optionCount})`}
                extra={
                    <Tooltip placement="top" title={addToolTipText}>
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<PlusOutlined />}
                            onClick={addOptionClickHandler}
                        />
                    </Tooltip>
                }
            >
                <Row justify="space-around" gutter={24}>
                    {addOptions()}
                    {/* {quiz.questions
                        .find((question) => question.id === parentKey)
                        .options.map((option) => {
                            return (
                                <Option data={option} questionKey={parentKey} />
                            );
                        })} */}
                </Row>
            </Card>
        </div>
    );
};

export default OptionsCard;
