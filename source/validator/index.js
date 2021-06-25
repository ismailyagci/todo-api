/**
 *  @type {{ 
 *      value: String,
 *      propsName: String,  
 *      validateType: "name" | "userName" | "mailOrPhoneNumber" | "password" 
 *  }} 
*/
const interfaces = {
    value: String,
    propsName: String,
    validateType: String
};

/* Imports */
import { name, userName, password, mail, phoneNumber } from "./validators";
import { validateTypeDetector, errorMessageConverter } from "./validatorTools";

const validator = async (validations = [interfaces]) => {
    for (let index = 0; index < validations.length; index++) {
        const element = validations[index];
        const validateResult = await validateDetector(element);

        /* Validate Result Controller */
        if (validateResult.code !== 200) {
            return validateResult
        }
        else if (index + 1 === validations.length) {
            return {
                code: 200,
                message: "Bütün validationlar başarılı"
            }
        }
    }
};

const validateDetector = async (element = interfaces) => {
    switch (element.validateType) {
        case "name": {
            return await name(element.value, element.propsName);
        }
        case "userName": {
            return await userName(element.value, element.propsName)
        }
        case "mailOrPhoneNumber": {
            return await validateTypeDetector({
                value: element.value,
                propsName: element.propsName,
                triedValidations: ["mail", "phoneNumber"],
            })
        }
        case "password": {
            return password(element.value, element.propsName);
        }
        default:
            break;
    }
};

export default validator;
export {
    mail,
    name,
    password,
    phoneNumber,
    userName,
    validateTypeDetector,
    errorMessageConverter,
}