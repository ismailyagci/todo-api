/** 
* @type {{
*   types: Array,
*   controlledData: String,
*   errorPropName: String,
* }}
*/
export const interfaces = {
    types: Array,
    controlledData: String,
    errorPropName: String,
};

/**  Bu fonksiyon bir array içerisindeki belli typeların (["section1", "section2"]) controlled data içerisinde var olup olmadığını kontrol etmek için kullanılır.
 * @example 
 * customTypesControllers({
 *    types: ["section1", "section2"]
 *    controlledData: "section1",
 *    errorPropName: "test"
 * })
 */
const customTypesControllers = async (args = interfaces) => {
    const {
        controlledData,
        errorPropName,
        types
    } = args;
    const controll = types.filter((type) => type === controlledData);

    /* Bir type bulunmuş ise */
    if (controll.length !== 0) {
        return {
            status: true,
            message: "Başarı ile bulunmuştur",
            code: 200
        }
    }
    /* Bulunmamış ise */
    else {
        return {
            status: false,
            message: `${errorPropName}' sadece (${types}) verilerinden birini alabilir. Bulunamadı: ${controlledData}`,
            code: 404
        }
    }
};

export default customTypesControllers;