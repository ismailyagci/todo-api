import {
    Tables
} from "../generalInterfaces";

/**
* @type {{
*   tableName: Tables
*   controlled: String
* }}
*/
const tableNameControllers = {
    tableName: String,
    controlled: String
}

/**
* @type {{
*  ids: [String] | [Object],
*  tableName: Tables,
*  customPropName: String,
*  tableNameControllers: [tableNameControllers]
*  tableNameControlleredPropName: String,
*  customFilter: Object,
* }}
*/
const interfaces = {
    ids: Array,
    tableName: String,
    customPropName: String,
    tableNameControllers: Array,
    tableNameControlleredPropName: String,
    customFilter: Object,
};

/** 
* Bu fonkiyon bir array içerisindeki id leri undefined controller yapısına hazırlamak için kullanılmaktadır.
* @example 
* undefindControllerTypesConverter({
*    ids: ["id1", "id2"],
*    tableName: "exampleTableName"
* })
*/
const undefindControllerTypesConverter = ({
    tableNameControlleredPropName,
    tableNameControllers,
    customPropName,
    customFilter,
    tableName,
    ids
} = interfaces, errorMessage) => {
    if(ids.length === 0) return [];
    
    const converts = [];

    for (let index = 0; index < ids.length; index++) {
        const id = ids[index];
        const converted = {};

        /* Id Control */
        if (customPropName) {
            converted.id = id[customPropName]
        }
        else {
            converted.id = id;
        }

        /* Table Name Controller */
        if (tableNameControllers && tableNameControllers.length !== 0) {
            const newTableName = tableNameControllers.filter((val) => val.controlled === id[tableNameControlleredPropName]);
            if (newTableName.length !== 0) {
                converted.tableName = newTableName[0].tableName;
            }
            else {
                return {
                    code: 404,
                    message: errorMessage
                }
            }
        }
        else {
            converted.tableName = tableName;
        }

        /* Custom filter controller */
        if (customFilter) {
            converted.customFilter = customFilter;
        }

        /* Custom filter */
        converts.push(converted);

        if (index + 1 === ids.length) return converts;
    }

};

export default undefindControllerTypesConverter;

