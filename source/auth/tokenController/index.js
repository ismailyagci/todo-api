import {
    db
} from "../../tools";

const tokenController = async ({
    token
}) => {
    if (token && token.length !== 0) {
        return await db.get({
            tableName: "users",
            contains: [
                {
                    propName: "tokens",
                    value: token
                }
            ],
            returnDataPropName: "data"
        }).then(async (res) => {
            if (res.status && res.data.length) {
                const userData = res.data[0];
                return {
                    code: 200,
                    message: "Başarılı ile kullanıcını verisi bulunmuştur.",
                    userData: {
                        userName: userData.userName,
                        profileImage: userData.profileImage,
                        fullName: userData.fullName
                    }
                };
            }
            else return {
                code: 404,
                message: "Kullanıcı tokenı bulunamadı",
                userData: {}
            };
        })
    }
    else {
        return {
            message: "Kullancıcı tokenı bulunamadı.",
            code: 404,
            userData: {}
        };
    };
};
export default tokenController;