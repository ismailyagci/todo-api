const SafeAllTodos = `
    type SafeAllTodos {
        data: [Todo],
        response: Response
    }

    type Todo {
        id: String,
        title: String,
        image: String,
        content: String,
    }   
`;
export default SafeAllTodos;