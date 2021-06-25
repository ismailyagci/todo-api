import {
    r
} from "../../../db"
import {
    DB_NAME
} from "../../../constants";
import {
    Tables
} from "../generalInterfaces";
/**
 * @type {{
 *     tableName: Tables,
 *     filter: Object,
 *     errorMessage: String,
 *     undefinedControl: Boolean,
 * }} 
**/
const interfaces = {
    tableName: String,
    filter: Object,
    errorMessage: String,
    undefinedControl: Boolean //Sistemde verinin var olmaması halinde olumlu sonuç döndürmek için default(false),
};

/** 
* Belirtilen tablolar içinde gerekli filter işlemlerini yapar eğer bir sonuç bulunmuş ise false, bulunmamış ise true döner kullanım amacı sistemde var olan bir veriden 2 tane olmamasıdır.  
* @example
   dataController({
        tableName: Tables,
        filter: {
            id: id,
            visible: true
        },
        errorMessage: "Sistemde Böyle bir veri bulundu",
        undefinedControl: false 
   })
*/
const dataController = async (args = interfaces) => {
    return await new Promise(async (resolve, reject) => {
        const {
            undefinedControl,
            errorMessage,
            tableName,
            filter
        } = args;
        const newUndefinedControl = undefinedControl ? undefinedControl : false;

        return await r.db(DB_NAME).table(tableName).filter(filter).then((res) => {
            if (newUndefinedControl === false) {
                if (res.length !== 0) {
                    resolve({
                        status: false,
                        code: 400,
                        message: errorMessage,
                        data: res[0]
                    });
                }
                else {
                    resolve({
                        status: true,
                        code: 200,
                        message: "Sistemde böyle bir veri bulunamadı",
                        data: {}
                    });
                }
            }
            else {
                if (res.length !== 0) {
                    resolve({
                        status: true,
                        code: 200,
                        message: "Sistemde böyle bir veri bulundu",
                        data: res[0]
                    });
                }
                else {
                    resolve({
                        status: false,
                        code: 400,
                        message: errorMessage,
                    });
                }
            }
        });
    });
};

export default dataController;