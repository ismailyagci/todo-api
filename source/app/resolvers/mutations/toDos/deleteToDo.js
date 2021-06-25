import {
    userOwnershipController,
    undefinedController,
    db
} from "../../../../tools";
import {
    pubsub
} from "../../../../../index";

const deleteToDo = async (obj, args, context) => {
    try {
        /* Variables */
        const userID = context.data.userID;
        const id = args.id;

        const undefinedControl = await undefinedController({
            tableName: "todos",
            id: id
        });
        if (!undefinedControl.status) return undefinedControl;

        const userOwnershipControllerResult = await userOwnershipController({
            tableName: "todos",
            userID: userID,
            dataID: id,
        });
        if (!userOwnershipControllerResult.status) return userOwnershipControllerResult.response

        return await db.update({
            tableName: "todos",
            filter: {
                id: id,
                visible: true
            },
            data: {
                visible: false
            }
        }).then((res) => {
            if (res.status) {
                pubsub.publish("onChangeTodos", {
                    onChangeTodos: {
                        data: [
                            {
                                id: id
                            }
                        ],
                        response: {
                            code: 200,
                            message: "Başarı ile getirilmiştir"
                        },
                        type: "delete"
                    },
                    userID: userID,
                });
            };
            return res;
        })
    } catch (error) {
        return {
            message: "Hata " + error,
            code: 500
        }
    }
};
export default deleteToDo;