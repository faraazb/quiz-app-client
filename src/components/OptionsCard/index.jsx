import { useState } from "react";
import uniqid from "uniqid";
import React from "react";
import { Card, Button, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Option from "../Option";
import "./index.css";

const OptionsCard = () => {
    const [optionList, setOptionList] = useState([]);
    //Function to add a new option
    const addOptionClickHandler = () => {
        //unique id for each option
        const optionKey = uniqid();
        const newOption = (
            <Col xs={22} sm={12} hoverable={false} key={optionKey}>
                <Option
                    removeOnClickHandler={removeOptionClickHandler}
                    parentKey={optionKey}
                />
            </Col>
        );
        setOptionList(optionList.concat(newOption));
    };

    //Function to remove a option from optionList if key provided
    const removeOptionClickHandler = (event, key) => {
        if (!key) return;
        setOptionList((optionList) => {
            //remove option from option list if its key matches
            return optionList.filter((option) => option.key !== key);
        });
    };

    return (
        <div className="optionContainer">
            <Card
                title={`Options (${optionList.length})`}
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
                    {optionList}
                </Row>
            </Card>
        </div>
    );
};

export default OptionsCard;
