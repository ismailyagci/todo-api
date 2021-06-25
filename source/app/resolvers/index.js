/* Queries */
import Query from "./queries";

/* Mutations */
import Mutation from "./mutations";

/* Subscriptions */
import Subscription from "./subscriptions";

const resolvers = {
    Query: Query,
    Mutation: Mutation,
    Subscription: Subscription
};

export default resolvers;