import { PaintingToAddType, PaintingType } from "./paintingSlice";
import { QuestionsFromAIType, UserLoginType, UserToAddType } from "./userSlice";
import { CommentPostModel } from "./commentSlice";
import api from "../api/axios";

const paintingURL = "painting";
const authURL = "Auth";
const commentURL = "comment";
const categoryURL = "category";
const userURL = "user";

export const fetchPaintings = async () => {
    try {
        const response = await api.get(paintingURL);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const fetchPaintingById = async (id: number) => {
    try {
        const response = await api.get(`${paintingURL}/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const addPainting = async (painting: PaintingToAddType) => {
    try {
        const response = await api.post(paintingURL, painting);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const addLike = async (id: number, count: number) => {
    console.log(count + " add like");

    try {
        const response = await api.post(
            `${paintingURL}/${id}/like?count=${count}`,
            {}
        );

        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const Login = async (user: UserLoginType) => {
    try {
        const response = await api.post(`${authURL}/login`, user);
        return response.data;
    } catch (e) {
        console.log("login error");
        console.log(e);
        throw e;
    }
};

export const Register = async (user: UserToAddType) => {
    try {
        const response = await api.post(`${authURL}/register`, user);
        return response.data;
    } catch (e) {
        console.log(e);
        throw e;
    }
};

export const fetchComments = async () => {
    try {
        const response = await api.get(commentURL);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const addComment = async (comment: CommentPostModel) => {
    try {
        const response = await api.post(commentURL, comment);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const updateComment = async (
    id: number,
    comment: CommentPostModel
) => {
    try {
        const response = await api.put(
            `${commentURL}/${id}`,
            comment
        );

        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deleteComment = async (id: number) => {
    try {
        await api.delete(`${commentURL}/${id}`);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const uploadPainting = async (
    painting: PaintingToAddType
) => {
    const formData = new FormData();

    formData.append("OwnerId", painting.ownerId.toString());
    formData.append("Name", painting.name);
    formData.append("CategoryId", painting.categoryId.toString());
    formData.append("paintingFile", painting.paintingFile);

    try {
        const response = await api.post(
            `${paintingURL}/upload`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getTest = async (): Promise<QuestionsFromAIType> => {
    try {
        const response = await api.get("AI?subject=logic");

        if (!Array.isArray(response.data)) {
            throw new Error("Expected an array of questions");
        }

        if (response.data.length !== 3) {
            throw new Error(
                `Expected exactly 3 questions, got ${response.data.length}`
            );
        }

        if (
            !response.data.every(
                (item) => typeof item === "string"
            )
        ) {
            throw new Error(
                "All items in the array must be strings"
            );
        }

        return response.data as QuestionsFromAIType;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const checkAnswers = async ({
    subject,
    questions,
    answers,
}: {
    subject: string;
    questions: string[];
    answers: string[];
}) => {
    try {
        const response = await api.post("AI/check", {
            subject,
            questions,
            answers,
        });

        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        const response = await api.get(userURL);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deletePainting = async (
    painting: PaintingType,
    userId: number
) => {
    if (userId !== painting.ownerId) {
        throw new Error("Unauthorized");
    }

    try {
        const response = await api.delete(
            `${paintingURL}/${painting.id}`
        );

        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const fetchCategories = async () => {
    try {
        const response = await api.get(categoryURL);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const fetchCategoryById = async (id: number) => {
    try {
        const response = await api.get(
            `${categoryURL}/${id}`
        );

        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const updateUser = async (
    userId: number,
    userData: UserToAddType
) => {
    try {
        const response = await api.put(
            `${userURL}/${userId}`,
            userData
        );

        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};