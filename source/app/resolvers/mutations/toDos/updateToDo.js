import {
    userOwnershipController,
    undefinedController,
    upload,
    db
} from "../../../../tools";
import {
    pubsub
} from "../../../../../index";

const updateToDo = async (obj, args, context) => {
    try {
        /* Variables */
        const userID = context.data.userID;
        const content = args.content;
        const title = args.title;
        const image = args.image;
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


        const updateData = {
            content: content,
            title: title,
        };

        const uploadImageResult = await upload.uploadImage(args.image && args.image.promise ? image.promise : undefined);
        if (args.uploadImageResult && args.backgroundImage.promise && !uploadImageResult.status) return {
            message: "Resim yükleme işleminde bir hata oluşmuştur",
            code: 404
        }
        else if (args.image && args.image.promise) {
            updateData.image = uploadImageResult.fileName;
        };

        return await db.update({
            tableName: "todos",
            filter: {
                id: id,
                visible: true
            },
            data: updateData
        }).then((res) => {
            if (res.status) {
                const newData = userOwnershipControllerResult.data;
                newData.title = title;
                newData.content = content;
                if(updateData.image) newData.image = updateData.image;

                pubsub.publish("onChangeTodos", {
                    onChangeTodos: {
                        data: [newData],
                        response: {
                            code: 200,
                            message: "Başarı ile getirilmiştir"
                        },
                        type: "update"
                    },
                    userID: userID,
                });
            }
            return res;
        })
    } catch (error) {
        return {
            message: "Hata " + error,
            code: 500
        };
    };
};
export default updateToDo;