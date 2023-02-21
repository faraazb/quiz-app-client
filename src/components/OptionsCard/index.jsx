import { useState } from "react";
import uniqid from "uniqid";
import React from "react";
import { Card, Button, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Option from "../Option";
import {
    GetQuizContext,
    GetQuizHandlerContext,
} from "../../contexts/CreateQuizContexts";
import "./index.css";

const OptionsCard = (props) => {
    const { parentKey } = props;
    const { quiz } = GetQuizContext();
    const { handleAddOption } = GetQuizHandlerContext();

    //Function to add a new option
    const addOptionClickHandler = () => {
        handleAddOption(parentKey);
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
                title={`Options`}
                extra={
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<PlusOutlined />}
                        onClick={addOptionClickHandler}
                    />
                }
            >
                <Row justify="space-around" gutter={24}>
                    {quiz.questions
                        .find((question) => question.id === parentKey)
                        .options.map((option) => getOption(option))}
                </Row>
            </Card>
        </div>
    );
};

export default OptionsCard;
