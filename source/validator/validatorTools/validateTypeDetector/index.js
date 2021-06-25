/**
*  @type {{                                                                    
*      value: String,    
*      propsName: String,                                 
*      triedValidations: [ "mail" | "phoneNumber" | "userName" ],
*      existTypeControl: Boolean
*  }} 
**/
const interfaces = {
    value: String,
    propsName: String,
    triedValidations: Array,
    existTypeControl: Boolean
};

/* Imports */
import errorMessageConverter from "../errorMessageConverter";
import { mail, userName, phoneNumber } from "../../validators";

const validateTypeDetector = async (props = interfaces) => {
    const { value, triedValidations, propsName } = props;
    const existTypesCodes = [1002, 1004, 1006];
    const types = {
        phoneNumber,
        mail,
        userName
    };

    for (let index = 0; index < triedValidations.length; index++) {
        /* Controllers */
        const validationName = triedValidations[index];
        const validateFunction = types[validationName];
        const validationResult = await validateFunction(value, propsName, props.existTypeControl);
        const existTypeController = existTypesCodes.filter(val => val === validationResult.code);

        /* Return Controllers */
        if (validationResult.code === 200) {
            return {
                code: 200,
                message: "Başarı ile bulunmuştur",
                validationType: validationName,
            }
        }
        else if (existTypeController.length !== 0) {
            return validationResult
        }
        else if (index + 1 === triedValidations.length) {
            return errorMessageConverter(1008, propsName)
        }
    }
};

export default validateTypeDetector;