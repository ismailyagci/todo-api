/* Express & Server Confugrations Packets */
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import path from "path";
import {
    createServer
} from "http";

/* GraphQL Packets */
import {
    subscribe,
    execute
} from "graphql";
import {
    graphqlHTTP
} from 'express-graphql';
import {
    graphqlUploadExpress
} from 'graphql-upload';
import {
    SubscriptionServer
} from 'subscriptions-transport-ws';
import {
    PubSub
} from 'graphql-subscriptions';

/* GraphQL EndPoints Schemas */
import appSchema from './source/app/schema';

/* Tools */
import {
    jwtTokenController
} from "./source/tools";

/* Auth Imports */
import {
    tokenController,
    signup,
    signin
} from "./source/auth";

/* Server Configrations */
const serverIP = "192.168.56.1";
const port = process.env.PORT || 4000;
const wsPort = 4001;
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

/* Auth Process */
app.post("/auth/signup", async (req, res) => {
    const result = await signup(req.body);
    res.send(result);
});
app.post("/auth/signin", async (req, res) => {
    const result = await signin(req.body);
    res.send(result);
});
app.post("/auth/tokenController", async (req, res) => {
    const result = await tokenController(req.body);
    res.send(result);
});
export const pubsub = new PubSub();

/* App Procces */
app.use("/app",
    async (request, response, next) => {
        await jwtTokenController(request, "users").then((res) => {
            if (res) {
                request.data = {
                    userID: res.userID
                };
                next();
            }
            else {
                response.send({
                    message: "Üzgünüz bir hata oluşu",
                    code: 500
                });
            }

        }).catch((err) => {
            response.send({
                message: err.message,
                code: err.code
            });
        })
    },
    graphqlUploadExpress({ maxFileSize: 90000000, maxFiles: 10 }),
    graphqlHTTP((request, response, graphQLParams) => ({
        schema: appSchema,
        context: request,
        graphiql: {
            subscriptionEndpoint: `ws://${serverIP}:${wsPort}/subscriptions`,
            headerEditorEnabled: true
        }
    }))
);

/* Static Files */
app.use('/images', express.static(path.join(__dirname + '/source/uploadedImages')));

/* Sever */
const ws = createServer(app);
ws.listen(wsPort, () => {
    // Set up the WebSocket for handling GraphQL subscriptions.
    new SubscriptionServer(
        {
            execute,
            subscribe,
            schema: appSchema,
            onConnect: async (connectionParams, webSocket) => {
                if (connectionParams && connectionParams["x-access-token"]) {
                    const request = {
                        headers: connectionParams
                    };
                    return await jwtTokenController(request, "users").then((res) => {
                        if (res.code === 200) {
                            return {
                                userID: res.userID
                            }
                        }
                        else {
                            throw new Error('Missing auth token!');
                        }
                    }).catch((err) => {
                        throw new Error('Missing auth token!');
                    })
                }
                else {
                    throw new Error('Missing auth token!');
                }
            }
        },
        {
            server: ws,
            path: '/subscriptions',
        },
    );
    console.log("Subscription server start on localhost" + wsPort);
});

app.listen(port, () => {
    console.log("Server start on localhost:" + port);
});