export const storeState = (state: any, localStorageKey: string) => {
    localStorage.setItem(localStorageKey, JSON.stringify(state))
}