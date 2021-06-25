import {
    r
} from "../../../db";
import {
    Tables
} from "../../controllers/generalInterfaces";
import {
    DB_NAME
} from "../../../constants";

/**
* @type {{
*  tableName: Tables,
*  id: String,
*  filter: Object,
*  data: Object
* }}
*/
const interfaces = {
    tableName: String,
    id: String,
    filter: Object,
    data: Object
};

/** Dbdeki bir veriyi güncellemek için kullandığımız fonksyion
*   @example 
    update({
        tableName: "users",
        id: "1233" || filter: { id: "123" }
        data: {
            test: "123"
        }
    })
* 
*/
const update = async ({
    tableName,
    filter,
    data,
    id
} = interfaces) => {
    return await r.db(DB_NAME).table(tableName)
        .filter(id ? {
            id: id,
            visible: true
        } : filter)
        .update(data).then((res) => {
            if (res.replaced !== 0 || res.unchanged !== 0) {
                return {
                    code: 200,
                    status: true,
                    message: "Başarı ile güncellenmiştir"
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
export default update;
