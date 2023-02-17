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
    //Function to add a new option
    const addOptionClickHandler = () => {
        //unique id for each option
        const optionKey = uniqid();
        const newOption = (
            <Card.Grid style={gridStyle} hoverable={false} key={optionKey}>
                <Option
                    removeOnClickHandler={removeOptionClickHandler}
                    parentKey={optionKey}
                />
            </Card.Grid>
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
                {optionList}
            </Card>
        </div>
    );
};

export default OptionsCard;
