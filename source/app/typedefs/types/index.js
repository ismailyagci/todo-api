import gql from "graphql-tag";

/* General Types */
import Response from "./general/Response";
import Upload from "./general/Upload";

import SafeAllTodos from "./toDos/SafeAllTodos";

/* Exports */
const types = gql`
    ${Response},
    ${Upload},
    ${SafeAllTodos}
`;
export default types;