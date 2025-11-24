const authAction = {
    getToken: async () => {
        return localStorage.getItem('accessToken')
    },

    getRefreshToken: async () => {
        return localStorage.getItem('refreshToken')
    },

    setToken: async (accessToken: string, refreshToken: string) => {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
    },

    clearToken: async () => {
        localStorage.clear()
    },
}

export default authAction
