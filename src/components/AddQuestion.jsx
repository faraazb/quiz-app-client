import { Button } from "antd";
import {
    GetQuizContext,
    GetQuizHandlerContext,
} from "../contexts/CreateQuizContexts";

import Question from "./Question";

const AddQuestion = () => {
    const { quiz } = GetQuizContext();
    const { handleAddQuestion } = GetQuizHandlerContext();
    console.log("Quiz", quiz);
    return (
        <div style={{ margin: "5%" }}>
            <Button onClick={handleAddQuestion}>Add Question</Button>
            <div>
                {quiz.questions.map((question, index) => {
                    return (
                        <div key={question.id}>
                            <Question
                                title={`Question ${index + 1}`}
                                data={question}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AddQuestion;
