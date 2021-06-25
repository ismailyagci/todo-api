import {
    db
} from "../../../../tools";

const getAllTodos = async (obj, args, context) => {
    try {
        const userID = context.data.userID;
        return await db.get({
            tableName: "todos",
            filter: {
                userID: userID,
                visible: true,
            },
            returnDataPropName: "data"
        });
    } catch (error) {
        return {
            data: {},
            response: {
                message: "Hata :" + error,
                code: 500
            }
        }
    }
};

export default getAllTodos;