import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URI;

const api = axios.create({
    baseURL: API_BASE_URL,
});
async function getQuizzesApi() {
    try {
        return await api.get("quizzes/");
    } catch (err) {
        throw err;
    }
}
async function postQuizzesApi(values) {
    try {
        return await api.post("quizzes/", values);
    } catch (err) {
        throw err;
    }
}
async function getQuizzesByIdApi(id) {
    return await api.get(`quizzes/${id}`);
}
async function putQuizzesByIdApi(id, values) {
    console.log(id, values);
    return await api.put(`quizzes/${id}`, values);
}
async function getSubmissions(quizId) {
    try {
        const response = await api.get(`quizzes/${quizId}/submissions`);
        if (response.data.data) {
            return response.data.data;
        } else {
            throw new Error("Failed to get submissions");
        }
    } catch (err) {
        throw err;
    }
}
async function saveSubmission(quizId, submmission) {
    try {
        const response = await api.post(
            `quizzes/${quizId}/submissions`,
            submmission
        );
        console.log("Res", response);
        if (response.data.data) return response.data.data;
        else throw new Error("Failed to get submissions");
    } catch (err) {
        throw err;
    }
}

async function getSubmissionsByIdApi(id) {
    return await api.get(`submissions/${id}`);
}

async function getQuestionsApi(quizId) {
    return await api.get(`quizzes/${quizId}/questions`);
}
async function getQuestionByIdApi(id) {
    return await api.get(`questions/${id}`);
}

export {
    getSubmissions,
    saveSubmission,
    getQuizzesApi,
    postQuizzesApi,
    getQuizzesByIdApi,
    putQuizzesByIdApi,
    getSubmissionsByIdApi,
    getQuestionsApi,
    getQuestionByIdApi,
};
