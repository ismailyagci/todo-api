import {
    r
} from "../../../db";
import {
    DB_NAME
} from "../../../constants";
import {
    Tables
} from "../generalInterfaces";
/**
 * @type {{
 *    id: String,
 *    tableName: Tables,
 *    customFilter: Object,
 *    customErrorMessage: String,
 * }}
*/
const interfaces = {
    id: String,
    tableName: String,
    customFilter: Object,
    customErrorMessage: String
}

/** 
*   Sistemde bir verinin var olup olmadığını kontrol eder. Kullanım amacı bir veri oluşturulken içinde bulunacak id lerin bir veri bütününe sahip olup olmadığıdır. 
*   @example 
    undefinedControler({
        tableName: Tables,
        id: id
    })
**/
const undefinedControler = async (args = interfaces) => {
    const {
        tableName,
        id
    } = args;

    return await r.db(DB_NAME).table(tableName).filter(args.customFilter ? args.customFilter : {
        id,
        visible: true
    }).then((res) => {
        if (res.length !== 0) {
            return {
                status: true,
                message: "Başarı ile bulunmuştur",
                data: res
            }
        }
        else {
            return {
                status: false,
                message: args.customErrorMessage ? args.customErrorMessage : `${tableName} tablosunda ${id}' li bir veri bulunamamıştır`,
                code: 404,
                data: {}
            };
        };
    }).catch((err) => {
    })
};
export default undefinedControler;