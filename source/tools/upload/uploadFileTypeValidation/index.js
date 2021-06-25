
/**
*  @type {{                                                                    
*      type: String,    
*      validType: "image" | "audio" | "video" ,
*  }} 
**/
const uploadFileTypeValidation = async (type, validType) => {
    const imageTypes = [".png", ".jpg", ".jpeg", ".svg"];
    const musicTypes = [".mp3", ".vav"];
    const videoTypes = [".mp4", ".mov", ".wmv", ".flv", ".avi"];
    if (validType === "image") {
        return await validationFor(type, imageTypes);
    }
    else if (validType === "audio") {
        return await validationFor(type, musicTypes);
    }
    else if (validType === "video") {
        return await validationFor(type, videoTypes);
    }
}

const validationFor = (type, validType) => {
    return new Promise((resolve, reject) => {
        for (let index = 0; index < validType.length; index++) {
            const element = validType[index];
            const detect = type.toLowerCase().slice(type.length - element.length, type.length);

            if (element === detect) {
                resolve(true)
            }
            else if (index + 1 === validType.length) {
                resolve(false)
            }
        }
    })
}

export default uploadFileTypeValidation