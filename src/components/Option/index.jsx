import { Button, Checkbox } from "antd";
import Input from "antd/es/input/Input";
import { MinusOutlined } from "@ant-design/icons";

const Option = (props) => {
    const { removeOnClickHandler, parentKey } = props;
    return (
        <Input
            addonBefore={<Checkbox />}
            addonAfter={
                <Button
                    type="primary"
                    size="small"
                    icon={<MinusOutlined />}
                    onClick={(event) => {
                        removeOnClickHandler(event, parentKey);
                    }}
                />
            }
        />
    );
};

export default Option;
