export const USERS=[
    {
        id: 100,
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: "admin",
        created_at: "2022-01-01T00:00:00.000Z",
        online: false,
        authorization: {
            token: "",
            key: "",
            expires: "",
        },
        history:{
            login: [],
            interactions: [],
            deleted: [],
            edited: []
        },
        profile:{
            tumbtag: "",
            profilepic: "",
        }
    }
]