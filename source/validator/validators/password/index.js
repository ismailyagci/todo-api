import validator from "validator";
import { errorMessageConverter } from "../../validatorTools";

const password = (password, propsName) => {
    try {
        const validateResult = validator.isMD5(password);
        if (validateResult === true) {
            return {
                code: 200,
                message: "Başarılı"
            }
        }
        else {
            return errorMessageConverter(1007, propsName ? propsName : "Şifre")
        }
    }
    catch (error) {
        return {
            code: 1001,
            message: "Bir hata oluştu"
        }
    }
};

export default password;