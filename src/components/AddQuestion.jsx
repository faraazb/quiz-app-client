import { Button } from "antd";
import { useContext } from "react";
import {
    quizContext,
    quizFunctionsContext,
} from "../contexts/CreateQuizContexts";

import Question from "./Question";

const AddQuestion = () => {
    const { quiz } = useContext(quizContext);
    const { handleAddQuestion } = useContext(quizFunctionsContext);
    console.log("Quiz", quiz);
    return (
        <div style={{ margin: "5%" }}>
            <Button onClick={handleAddQuestion}>Add Question</Button>
            <div>
                {quiz.questions.map((question) => {
                    return (
                        <div key={question.id}>
                            <Question
                                parentKey={question.id}
                                defaultPoint={quiz.settings.defaultPoints}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AddQuestion;
