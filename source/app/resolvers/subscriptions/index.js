import {
    withFilter
} from "graphql-subscriptions";
import {
    pubsub
} from "../../../../index";

export default {
    onChangeTodos: {
        subscribe: withFilter(
            () => pubsub.asyncIterator("onChangeTodos"),
            (payload, variables, context) => {
                return payload.userID === context.userID
            }
        )
    }
};