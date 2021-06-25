import {
    r
} from "../../../db";
import {
    Tables
} from "../generalInterfaces";
import {
    DB_NAME
} from "../../../constants";

/**
* @type {{
*   userID: String,
*   dataID: String,
*   tableName: Tables   
* }}
*/
const interfaces = {
    userID: String,
    dataID: String,
    tableName: String
};

/**
*  Bu fonksiyon bir kullanıcı, bir öğeyi güncellemek istediğinde, bu kullanıcının istenilen veriye erişiminin var olup olmadığını kontroll eder.
    @example 
    userOwnershipController({
        userID: "uuid"
        dataID: "uuid",
        tableName: "foods"
    });
**/
const userOwnershipController = async ({
    tableName,
    userID,
    dataID
} = interfaces) => {
    return await r.db(DB_NAME).table(tableName).filter({
        id: dataID,
        visible: true,
        userID: userID,
    }).then((res) => {
        if (res.length !== 0) {
            return {
                status: true,
                response: {
                    message: "Bu kullanıcı, bu öğeye erişebilir.",
                    code: 200
                },
                data: res[0]
            }
        }
        else {
            return {
                status: false,
                response: {
                    message: "Üzgünüz, bu öğeye erişim hakkınız yok!",
                    code: 404
                }
            }
        }
    })
};

export default userOwnershipController;