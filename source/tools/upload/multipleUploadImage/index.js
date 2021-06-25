import uploadImage from "../uploadImage";
import {
    v4 as uuid
} from "uuid";

/**
* @type {{
*   undefinedImagesUploadStatus: Boolean,  
*   createIdStatus: Boolean,
*   imagePropName: String,
*   oldImages: Array,  
*   images: Array,
* }}
*/
const interfaces = {
    undefinedImagesUploadStatus: Boolean,
    createIdStatus: Boolean,
    imagePropName: String,
    oldImages: Array,
    images: Array
};

/**
*   Bu fonksiyon bir array içerisinde objelerde bulunan resimleri sisteme yüklemek ve geri dönüş sağlamak için hazırlanmıştır.
*   @example   
    multipleUploadImage({
        images:[
            {
                backgroundImage: Upload,
                test: "123"
            }
        ],
        imagePropName: "backgroundImage",
        undefinedImagesUploadStatus: true //True ise ve imagePropName verisi bulunamamışsa images içerisindeki imagePropName verisini boş string olarak oluşturur.
    })

*/
const multipleUploadImage = async ({
    undefinedImagesUploadStatus,
    createIdStatus,
    imagePropName,
    oldImages,
    images
} = interfaces) => {
    return await new Promise(async (resolve, reject) => {
        const newImages = [];
        if (typeof images === "undefined" || images.length === 0) resolve({
            status: true,
            images: []
        });

        for (let index = 0; index < images.length; index++) {
            const imageContainerObject = images[index];

            /* Her bir upload objecti için kontrol */
            if (imageContainerObject[imagePropName] && imageContainerObject[imagePropName].promise) {
                const uploadImageResult = await uploadImage(imageContainerObject[imagePropName].promise);

                /* Upload işlemi başarısız ise geri dönüş sağlanır, değilse imagePropName object içerisinde tespit edilip yüklenen fileName olarak güncellenir */
                if (!uploadImageResult.status) {
                    resolve({
                        status: false,
                        message: "Üzgünüz resim yükleme sırasında bir hata oluştu",
                        code: 404
                    });
                }
                else {
                    /* Yeni bir id oluşturulacak ise */
                    if (createIdStatus && typeof imageContainerObject["id"] === "undefined") imageContainerObject["id"] = uuid();

                    /* Yüklenen resmi koymak için */
                    imageContainerObject[imagePropName] = uploadImageResult.fileName;
                    newImages.push(imageContainerObject);
                }
            }

            else if (undefinedImagesUploadStatus && undefinedImagesUploadStatus === true) {
                /* Yeni bir id oluşturulacak ise */
                if (createIdStatus && typeof imageContainerObject["id"] === "undefined") imageContainerObject["id"] = uuid();

                /* Onceki resmi geri yerine koymak için */
                if (oldImages && oldImages.length) {
                    const idFilterIndex = oldImages.findIndex((val) => val.id === imageContainerObject["id"]);
                    if (idFilterIndex === -1) {
                        imageContainerObject[imagePropName] = "";
                    }
                    else {
                        imageContainerObject[imagePropName] = oldImages[idFilterIndex][imagePropName];
                    };
                }
                else {
                    imageContainerObject[imagePropName] = "";
                }

                /* Geri dönüş */
                newImages.push(imageContainerObject);
            }
            else {
                /* Yeni bir id oluşturulacak ise */
                if (createIdStatus && typeof imageContainerObject["id"] === "undefined") imageContainerObject["id"] = uuid();

                /* Geri dönüş */
                newImages.push(imageContainerObject);
            }

            if (index + 1 === images.length) {
                resolve({
                    status: true,
                    images: newImages
                });
            }
        }
    });
};

export default multipleUploadImage;
