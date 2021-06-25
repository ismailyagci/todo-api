import uploadFileNameCreator from "../uploadFileNameCreator";
import {
    createWriteStream
} from "fs";
import {
    join
} from "path";
import {
    r
} from "../.././../db";
import {
    DB_NAME
} from "../../../constants";

/**
* @type {{
*    image: Promise,
*    tableName: "materials",
*    id: String
* }}
*/
const interfaces = {
    image: Promise,
    tableName: String,
    id: String
}

const updateImage = (args = interfaces) => {
    const { image, tableName, id } = args
    return new Promise(async function (resolve, reject) {
        if (image && image.promise) {
            const {
                createReadStream,
                filename
            } = await image.promise;
            
            const newFileName = await uploadFileNameCreator(filename, "image");
            if (newFileName.status === true) {
                const coolPath = join(__dirname + "../../../../uploadedImages/".concat(newFileName.fileName));
                return createReadStream().pipe(createWriteStream(coolPath)).on("finish", async () => {

                    /* Update Table */
                    return await r.db(DB_NAME).table(tableName).get(id).update({
                        backgroundImage: newFileName.fileName
                    }).then((res) => {
                        resolve({
                            status: true,
                            message: "Başarı ile güncellenmiştir"
                        })
                    });

                }).on("error", (err) => {
                    return reject({
                        status: false,
                        message: "Hata " + err
                    });
                });
            }
            else {
                resolve({
                    status: false,
                    message: ""
                })
            }
        }
        else {
            resolve({
                status: true,
                message: ""
            })
        }
    });
};

export default updateImage;