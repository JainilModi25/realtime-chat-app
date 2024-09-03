export const createAuthSlice = (set: any) => ({
        userInfo: undefined,     //state: initially undefined
        setUserInfo: (userInfo: any) => set({ userInfo })     //action to perform
    }
);