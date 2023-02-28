import { Button, Form, Input } from "antd";
import "./index.css";

const StartQuizPage = ({ startQuiz }) => {
    const [form] = Form.useForm();
    const onCheck = async () => {
        try {
            const { username } = await form.validateFields(["username"]);
            startQuiz(username);
        } catch (errorInfo) {}
    };
    return (
        <div className="startQuizPage">
            <Form id="form" form={form}>
                <Form.Item
                    name="username"
                    label="Name"
                    rules={[{ required: true, message: "Username required!" }]}
                >
                    <Input placeholder="username" />
                </Form.Item>

                <Form.Item className="button">
                    <Button type="primary" htmlType="button" onClick={onCheck}>
                        Start Quiz
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default StartQuizPage;
