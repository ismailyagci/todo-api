const subscription = `
    type Subscription {
        onChangeTodos: SafeSubscriptionTodos
    }

    type SafeSubscriptionTodos {
        data: [Todo],
        response: Response,
        type: String
    }
`;
export default subscription;