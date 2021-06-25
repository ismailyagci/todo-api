import {
    r
} from "../../../db";
import {
    DB_NAME
} from "../../../constants";
import {
    errorMessageConverter
} from "../../validatorTools";

const userName = async (userName, propsName, existTypeController) => {
    try {
        const validateResult = userName.match(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/ig) || [];
        if (validateResult.length !== 0) {
            /* Exist Controller */
            if (existTypeController) {
                return await r.db(DB_NAME).table("users").filter({
                    userName: userName,
                    visible: true
                }).then((res) => {
                    if (res.length !== 0) {
                        return errorMessageConverter(1002, "Kullanıcı Adı")
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
            return errorMessageConverter(1001, propsName)
        }
    }
    catch (error) {
        return {
            code: 1001,
            message: "Bir hata oluştu"
        }
    }
}

export default userName;