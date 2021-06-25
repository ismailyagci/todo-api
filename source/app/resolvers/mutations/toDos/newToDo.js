import {
    upload,
    db
} from "../../../../tools";
import {
    pubsub
} from "../../../../../index";
const newToDo = async (obj, args, context) => {
    try {
        /* Variables */
        const userID = context.data.userID;
        const content = args.content;
        const title = args.title;
        const image = args.image;

        const insertData = {
            createDate: new Date().toISOString(),
            content: content,
            userID: userID,
            visible: true,
            title: title,
            image: ""
        };

        const uploadImageResult = await upload.uploadImage(args.image && args.image.promise ? image.promise : undefined);
        if (args.uploadImageResult && args.backgroundImage.promise && !uploadImageResult.status) return {
            message: "Resim yükleme işleminde bir hata oluşmuştur",
            code: 404
        }
        else if (args.image && args.image.promise) {
            insertData.image = uploadImageResult.fileName;
        };


        return await db.insert({
            tableName: "todos",
            data: insertData
        }).then((res) => {
            if (res.status) {
                const id = res.ids[0];
                insertData.id = id;
                pubsub.publish("onChangeTodos", {
                    onChangeTodos: {
                        data: [insertData],
                        response: {
                            code: 200,
                            message: "Başarı ile getirilmiştir"
                        },
                        type: "add"
                    },
                    userID: userID,
                });
            }
            return res;
        });
    } catch (error) {
        return {
            message: "Hata " + error,
            code: 500
        };
    };
};
export default newToDo;