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
 * @type {[{
 *    tableName: Tables
 *    id: String,
 *    customFilter: Object,
 * }]}
*/
const interfaces = [{
    tableName: String,
    id: String,
    customFilter: Object,
}]

/** 
* Sistemde bir verinin var olup olmadığını kontrol eder. Kullanım amacı bir veri oluşturulken içinde bulunacak id lerin bir veri bütününe sahip olup olmadığıdır.  
* @example 
* multipleUndefinedController([
    {
        tableName: "materialsCategories",
        id: id
    },
    {
        tableName: "materialsTypes",
        id: id
    }
  ])
**/

const multipleUndefinedController = async (args = interfaces) => {
    return await new Promise(async (resolve, reject) => {
        const errorMessage = {};
        const foundDatas = [];

        for (let index = 0; index < args.length; index++) {
            const {
                tableName,
                id
            } = args[index];
            const customFilter = args.customFilter ? args.customFilter : null;

            await r.db(DB_NAME).table(tableName).filter({
                id,
                visible: true,
                ...customFilter
            }).then((res) => {
                if (res.length !== 0) {
                    const newResponse = res[0];
                    newResponse.filterTypeID = id;
                    foundDatas.push(newResponse);
                }
                else {
                    errorMessage.status = false;
                    errorMessage.message = `${tableName} tablosunda ${id}' li bir veri bulunamamıştır`;
                    errorMessage.code = 404;
                    errorMessage.datas = [];
                };
            }).catch((err) => {
            });
            if (Object.keys(errorMessage).length !== 0) {
                resolve(errorMessage);
            }
            else if (index + 1 === args.length) {
                resolve({
                    status: true,
                    message: "Başarı ile Bulundu",
                    code: 200,
                    datas: foundDatas
                });
            }
        };
    })
};

export default multipleUndefinedController;