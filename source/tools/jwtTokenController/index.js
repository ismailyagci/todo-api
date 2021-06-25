import {
    r
} from "../../db";
import {
    TOKEN_SECRET_KEY,
    DB_NAME
} from "../../constants";
import jwt from "jsonwebtoken";

const jwtTokenController = async (request, tableName) => {
    return await new Promise(async (resolve, reject) => {
        const token = await request.headers["x-access-token"];
        /* Token Undefined Controll */
        if (typeof token === "undefined") {
            reject({
                message: "Token bulanamadı (x-access-token)",
                code: 404
            });
        }
        else {
            return jwt.verify(token, TOKEN_SECRET_KEY, async (error, decoded) => {
                /* On Error reject */
                if (error) {
                    reject({
                        message: "Üzgünüz token kontrolünde bir hata oluştu" + error,
                        code: 500
                    });
                }

                if (decoded && decoded.data) {
                    const decodedData = decoded.data;

                    /* User ID and Token filter */
                    await r.db(DB_NAME).table(tableName).filter(function (user) {
                        return {
                            id: decodedData.userID,
                            visible: true
                        }
                    }).filter(function (user) {
                        return user("tokens").contains(function (userTokens) {
                            return userTokens("token").eq(token)
                        });
                    }).then((userRes) => {
                        /* General Resolve And Rejects */
                        if (userRes.length !== 0 && typeof userRes !== "undefined") {
                            resolve({
                                message: "Başarıyla bulunmuştur",
                                code: 200,
                                userID: decoded.data.userID
                            })
                        }
                        else {
                            reject({
                                message: "Bu token'e ait bir kullanıcı bulunamamıştır.",
                                code: 400
                            })
                        }
                    });
                }
                else {
                    reject({
                        message: "Bu token'e ait bir kullanıcı bulunamamıştır.",
                        code: 400
                    })
                }

            });
        }
    });
};

export default jwtTokenController