import gql from "graphql-tag";

/* Main Types */
import subscription from "./subscription";
import mutation from "./mutation";
import query from "./query";
import types from "./types";

const typeDefs = gql`
    ${subscription},
    ${mutation},
    ${query},
    ${types},
`;

export default typeDefs;