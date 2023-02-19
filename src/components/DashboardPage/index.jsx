import "./dashboardPage.css";
import { Card, Col, Row } from 'antd';
import axios from "axios";
import { Button } from 'antd';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const DashboardPage = () => {
    const [quizzes, setQuizzes] = useState(null);
    const getQuizzes = async () => {
        try{
            const quizzes = await axios.get("http://localhost:5000/quizzes/");
            setQuizzes(quizzes);
            // console.log(quizzes.data.data);
        }
        catch(err)  {
            console.log(err);
        }
    };
    useEffect(() => {
        getQuizzes();
    }, []);
    return  (
        <div className='dashboard'>
            <Link to={"/quiz/create"}>
                <Button type="primary" shape='round'>Create Quiz</Button>
            </Link>
            <hr />
            <Row gutter={[10,10]} justify="center">
                {quizzes !== null && quizzes.data.data.map((quiz) => {
                    return (
                        <Col key = {quiz.id}>
                            <Card size="small" title={quiz.title} style={{ width: 200, height: 100 }}>
                                <p>{quiz.submissionsCount} Submissions</p>
                            </Card>
                        </Col>
                    )
                })}
            </Row>
        </div>
    )
}
export default DashboardPage;