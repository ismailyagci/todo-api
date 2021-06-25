import {
    r
} from "../../../db";
import {
    DB_NAME
} from "../../../constants";
import {
    Tables
} from "../../controllers/generalInterfaces";

/**
* @type {{
*  tableName: Tables,
*  data: Object
* }}
*/
const interfaces = {
    tableName: String,
    data: Object
};

/** Dbde ye veri eklemek için kullandığımız yapı 
*   @example 
    insert({
        tableName: "users",
        data: {
            test: "123"
        }
    })
* 
*/
const insert = async ({
    tableName,
    data
} = interfaces) => {
    return await r.db(DB_NAME).table(tableName).insert(data).then((res) => {
        if (res.inserted !== 0) {
            return {
                code: 200,
                status: true,
                message: "Başarı ile oluşturulmuştur",
                ids: res.generated_keys
            }
        }
        else {
            return {
                code: 500,
                status: false,
                message: "Üzgünüz bir hata oluştu"
            }
        }
    })
};

export default insert;
