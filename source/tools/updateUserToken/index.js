import {
    r
} from "../../db";
import {
    TOKEN_SECRET_KEY,
    DB_NAME
} from "../../constants";
import jwt from 'jsonwebtoken';

const updateUserToken = async (userID, tableName) => {
    return await new Promise(async (resolve, reject) => {
        const tokenConfigs = {
            data: {
                userID: userID
            }
        };

        const token = jwt.sign(tokenConfigs, TOKEN_SECRET_KEY);
        const updateTokenData = {
            id: await r.uuid(),
            signinDate: new Date().toISOString(),
            token: token,
            visible: true
        };

        return await r.db(DB_NAME).table(tableName).get(userID).update(function (userData) {
            return {
                tokens: userData("tokens").append(updateTokenData)
            }
        }).then(() => {
            resolve(token)
        })
    });
};

export default updateUserToken;