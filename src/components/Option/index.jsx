import { useState } from "react";
import { Button, Checkbox } from "antd";
import Input from "antd/es/input/Input";
import { MinusOutlined } from "@ant-design/icons";
import ErrorMessage from "../ErrorMessage";
import "./index.css";

const Option = (props) => {
    const { removeOnClickHandler, parentKey } = props;
    const [errorMessage, setErrorMessage] = useState("");
    const [optionStatus, setOptionStatus] = useState("");
    const optionOnChangeHandler = (event) => {
        const {
            target: { value },
        } = event;
        if (value.length < 1) {
            setOptionStatus("error");
            setErrorMessage("Empty option not allowed");
        } else {
            setOptionStatus("");
            setErrorMessage("");
        }
    };
    return (
        <div>
            <Input
                placeholder="option"
                allowClear={true}
                addonBefore={<Checkbox />}
                status={optionStatus}
                onChange={optionOnChangeHandler}
                onBlur={optionOnChangeHandler}
                autoFocus
                addonAfter={
                    <Button
                        type="primary"
                        size="small"
                        icon={<MinusOutlined />}
                        autoFocus
                        onClick={(event) => {
                            removeOnClickHandler(event, parentKey);
                        }}
                    />
                }
            />
            <div>
                <ErrorMessage
                    className="errorMessage"
                    errorMessage={errorMessage}
                />
            </div>
        </div>
    );
};

export default Option;
