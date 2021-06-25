const mutation = `
    type Mutation {
        newToDo (
            image: Upload,
            title: String!,
            content: String!,
        ): Response
        updateToDo (
            id: String!,
            image: Upload,
            title: String!,
            content: String!,
        ): Response
        deleteToDo (
            id: String!
        ): Response
    }
`;
export default mutation;