import { r } from "../../../db";
import uploadFileTypeValidation from "../uploadFileTypeValidation";

const uploadFileNameCreator = async (filename, validType) => {
    const uuidFileName = await r.uuid();
    const index = await lastDotDetector(filename);

    const length = filename.length;
    const type = filename.slice(index, length);
    const typeValid = await uploadFileTypeValidation(type, validType);
    if (typeValid === true) {
        const newFileName = uuidFileName + type;
        return {
            fileName: newFileName,
            status: true
        }
    }
    else {
        return {
            fileName: "",
            status: false
        }
    }
}

const lastDotDetector = async (fileName) => {
    return await new Promise((resolve, reject) => {
        let detectIndex = 0;
        for (let index = 0; index < fileName.length; index++) {
            const element = fileName[index];
            if (element === ".") {
                detectIndex = index
            }
            if (fileName.length - 1 == index) {
                resolve(detectIndex)
            }
        }
    })
};

export default uploadFileNameCreator;