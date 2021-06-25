import validator from "validator";
import {
    r
} from "../../../db";
import {
    DB_NAME
} from "../../../constants";
import {
    errorMessageConverter
} from "../../validatorTools";

const phoneNumber = async (phoneNumber, propsName, existTypeController) => {
    try {
        const validateResult = validator.isMobilePhone(phoneNumber, ["tr-TR"]);
        if (validateResult === true) {
            /* Exist Controller */
            if (existTypeController) {
                return await r.db(DB_NAME).table("users").filter({
                    phoneNumber: phoneNumber,
                    visible: true
                }).then((res) => {
                    if (res.length !== 0) {
                        return errorMessageConverter(1006, "Telefon Numarası")
                    }
                    else {
                        return {
                            code: 200,
                            message: "Başarılı"
                        }
                    }
                })
            }
            else {
                return {
                    code: 200,
                    message: "Başarılı"
                }
            }
        }
        else {
            return errorMessageConverter(1005, propsName ? propsName : "Telefon Numarası")
        }
    }
    catch (error) {
        return {
            code: 1001,
            message: "Bir hata oluştu"
        }
    }
};

export default phoneNumber;