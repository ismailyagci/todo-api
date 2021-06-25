import { r } from "../../../db";
import { Tables } from "../generalInterfaces";
import multipleUndefinedController from "../multipleUndefinedController";


/* Children Interfaces */
/**
* @type {{
*    objectKey: String,
*    tableName: Tables
* }}
*/
const controlledTypes = {
    objectKey: String,
    tableName: String,
}

/* General Interfaces */
/**
* @type {{
*   controlledDatas: Array,
*   controlledTypes: [controlledTypes]
* }}
* 
**/
const interfaces = {
    controlledDatas: Object,
    controlledTypes: Object
};

/**
 *  Bu fonksiyon bir arrayin içerisinde ve undefined controllers yapısına uygun olmayan verileri kontrol etmek için kullanılır.
 *   @example
 *   nestedUndefinedControllers({
            controlledDatas: {
                    testID: "123",
                    testID2: "123"
            }
            controlledTypes: [
                {
                    objectKey: "testID",
                    tableName: "numericalMeasures"
                },
                {
                    objectKey: "testID2",
                    tableName: "traditionalMeasures"
                }
            ]
        })
*/
const nestedUndefinedControllers = async (args = interfaces) => {
    return await new Promise(async (resolve, reject) => {
        const { controlledDatas, controlledTypes } = args;
        const _controlledDatas = [controlledDatas];
        const newControlledDatas = [];

        /* Converts */
        _controlledDatas.map((item) => {
            controlledTypes.map((typeItem) => {
                const newObject = {};
                newObject.id = item[typeItem.objectKey];
                newObject.tableName = typeItem.tableName;

                newControlledDatas.push(newObject);
            });
        });

        const controllerResult = await multipleUndefinedController(newControlledDatas);
        resolve(controllerResult);
    });
};


export default nestedUndefinedControllers;
