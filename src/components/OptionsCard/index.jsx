import { useState } from "react";
import uniqid from "uniqid";
import React from "react";
import { Card, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Option from "../Option";
import "./index.css";

const gridStyle = {
    width: "50%",
};

const OptionsCard = () => {
    const [optionList, setOptionList] = useState([]);

    const addOptionClickHandler = () => {
        const optionKey = uniqid();
        const newOption = (
            <Card.Grid style={gridStyle} key={optionKey}>
                <Option
                    removeOnClickHandler={removeOptionClickHandler}
                    parentKey={optionKey}
                />
            </Card.Grid>
        );
        setOptionList(optionList.concat(newOption));
    };

    const removeOptionClickHandler = (event, key) => {
        setOptionList((optionList) => {
            return optionList.filter((option) => option.key != key);
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
                {optionList}
            </Card>
        </div>
    );
};

export default OptionsCard;
