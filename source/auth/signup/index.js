import validatior, {
    validateTypeDetector,
    userName
} from "../../validator";
import {
    updateUserToken,
    db
} from "../../tools";

const signup = async (args) => {
    try {
        /* Default Controllers */
        const validateResult = await validatior([
            {
                value: args.userName,
                propsName: "Kullanıcı Adı",
                validateType: "userName",
            },
            {
                value: args.mailOrPhoneNumber,
                propsName: "E-posta Veya Telefon Numarası",
                validateType: "mailOrPhoneNumber",
            },
            {
                value: args.fullName,
                propsName: "İsim Soyisim",
                validateType: "name",
            },
            {
                value: args.password,
                propsName: "Şifre",
                validateType: "password",
            }
        ]);
        if (validateResult.code !== 200) return validateResult;

        /* Exist Mail Or PhoneNumber Controllers */
        const detectedMailOrPassword = await validateTypeDetector({
            value: args.mailOrPhoneNumber,
            propsName: "E-posta Veya Telefon Numarası",
            triedValidations: ["mail", "phoneNumber"],
            existTypeControl: true
        });
        if (detectedMailOrPassword.code !== 200) return detectedMailOrPassword;

        /* Exist User Name Controllers */
        const userNameController = await userName(args.userName, "Kullanıcı Adı", true)
        if (userNameController.code !== 200) return userNameController;

        return await createNewUser(args, detectedMailOrPassword)

    } catch (error) {
        return {
            message: "Bir Hata Oluştu" + error,
            code: 500
        }
    }
};

const createNewUser = async (args, detectedMailOrPassword) => {
    const insertData = {
        userName: args.userName,
        fullName: args.fullName,
        mail: detectedMailOrPassword.validationType === "mail" ? args.mailOrPhoneNumber : "",
        phoneNumber: detectedMailOrPassword.validationType === "phoneNumber" ? args.mailOrPhoneNumber : "",
        password: args.password,
        profileImage: "",
        description: "",
        gender: 1,
        city: "",
        birthDate: "",
        tokens: [],
        createDate: new Date().toISOString(),
        visible: true,
        emailConfirm: false,
        approvedUser: false
    };

    return await db.insert({
        tableName: "users",
        data: insertData
    }).then(async (res) => {
        return await updateUserToken(res.ids[0], "users").then((token) => {
            return {
                code: 200,
                message: "Başarı ile oluşturulmuştur",
                token: token
            };
        });
    });
};
export default signup;