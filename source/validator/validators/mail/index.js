import {
    r
} from "../../../db";
import validator from "validator";
import {
    DB_NAME
} from "../../../constants";
import {
    errorMessageConverter
} from "../../validatorTools";

const mail = async (mail, propsName, existTypeController) => {
    try {
        const validateResult = validator.isEmail(mail);
        if (validateResult === true) {
            /* Exist Controller */
            if (existTypeController) {
                return await r.db(DB_NAME).table("users").filter({
                    mail: mail,
                    visible: true
                }).then((res) => {
                    if (res.length !== 0) {
                        return errorMessageConverter(1004, "E-posta")
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
            return errorMessageConverter(1003, propsName ? propsName : "E-posta")
        }
    }
    catch (error) {
        return {
            code: 1001,
            message: "Bir hata oluştu"
        }
    }
};

export default mail;