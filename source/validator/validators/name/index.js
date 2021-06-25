import validator from "validator";
import { errorMessageConverter } from "../../validatorTools";

const name = async (name, propsName) => {
    try {
        name = name.replace(" ", "");
        const validateResult = validator.isAlpha(name, ["tr-TR"]);
        if (validateResult === true) {
            return {
                code: 200,
                message: "Başarılı"
            }
        }
        else {
            return errorMessageConverter(1000, propsName)
        }
    }
    catch (error) {
        return {
            code: 1001,
            message: "Bir hata oluştu"
        }
    }
};

export default name;