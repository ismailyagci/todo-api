import { createWriteStream, rename } from "fs";
import uploadFileNameCreator from "../uploadFileNameCreator";
import { join } from "path";

const uploadImage = (args) => {
    return new Promise(async function (resolve, reject) {
        if (args) {
            const { createReadStream, filename } = await args;
            const newFileName = await uploadFileNameCreator(filename, "image");
            if (newFileName.status === true) {
                const coolPath = join(__dirname + "../../../../uploadedImages/".concat(newFileName.fileName));
                return createReadStream().pipe(createWriteStream(coolPath)).on("finish", () => {
                    return resolve({
                        status: true,
                        fileName: newFileName.fileName
                    });
                }).on("error", (err) => {
                    return reject({
                        status: false,
                        fileName: ""
                    });
                });
            }
            else {
                resolve({
                    status: false,
                    fileName: ""
                })
            }
        }
        else {
            resolve({
                status: false,
                fileName: ""
            })
        }
    });
};

export default uploadImage;