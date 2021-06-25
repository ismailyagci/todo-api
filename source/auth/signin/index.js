import validatior, {
    validateTypeDetector,
    errorMessageConverter
} from "../../validator";
import {
    updateUserToken,
    db
} from "../../tools";

const signin = async (args) => {
    try {
        /* UserName Or Mail Or PhoneNumber Controllers */
        const detectedType = await validateTypeDetector({
            value: args.userNameOrmailOrPhoneNumber,
            propsName: "Kullanıcı Adı veya E-posta Veya Telefon Numarası",
            triedValidations: ["mail", "phoneNumber", "userName"],
        });
        if (detectedType.code !== 200) return detectedType;

        /* Default Controllers */
        const validateResult = await validatior([
            {
                value: args.password,
                propsName: "Şifre",
                validateType: "password",
            }
        ]);
        if (validateResult.code !== 200) return validateResult;

        /* Detect user */
        const filter = {};
        if (detectedType.validationType === "mail") filter.mail = args.userNameOrmailOrPhoneNumber;
        else if (detectedType.validationType === "phoneNumber") filter.phoneNumber = args.userNameOrmailOrPhoneNumber;
        else if (detectedType.validationType === "userName") filter.userName = args.userNameOrmailOrPhoneNumber;
        else {
            return errorMessageConverter(1008, "Kullanıcı Adı veya E-posta Veya Telefon Numarası");
        }
        filter.password = args.password;

        return await db.get({
            returnDataPropName: "data",
            tableName: "users",
            emptyStatus: true,
            filter: filter
        }).then(async (res) => {
            if (res.status) {
                const data = res.data[0];
                return await updateUserToken(data.id, "users").then((token) => {
                    return {
                        message: "Başarı ile bulunmuştur",
                        code: 200,
                        token: token
                    };
                });
            }
            else {
                return {
                    message: "Sistemimizde böyle bir kullanıcı bulunamamıştır",
                    code: 404
                };
            }
        });
    } catch (error) {
        return {
            message: "Bir Hata Oluştu" + error,
            code: 500
        }
    };
};
export default signin;