const ACCESS_KEY = 'petshop.accessToken'
const REFRESH_KEY = 'petshop.refreshToken'

export const tokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY) ?? sessionStorage.getItem(ACCESS_KEY)
  },
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY) ?? sessionStorage.getItem(REFRESH_KEY)
  },
  setTokens(accessToken: string, refreshToken: string, rememberMe: boolean): void {
    const storage = rememberMe ? localStorage : sessionStorage
    const other = rememberMe ? sessionStorage : localStorage
    storage.setItem(ACCESS_KEY, accessToken)
    storage.setItem(REFRESH_KEY, refreshToken)
    other.removeItem(ACCESS_KEY)
    other.removeItem(REFRESH_KEY)
  },
  clear(): void {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    sessionStorage.removeItem(ACCESS_KEY)
    sessionStorage.removeItem(REFRESH_KEY)
  },
}
