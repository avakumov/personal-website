import { api } from "../services/api"
import { Profile } from "../services/api"

interface IAuth {
  loginUrl: string
  logoutUrl: string
  rerender(profile: Profile): void
}

export class Auth {
  auth: IAuth
  constructor(auth: IAuth) {
    this.auth = auth
  }
  async init() {
    try {
      const { success, data: profile } = await api.getProfile()
      const url = window.sessionStorage.getItem("urlBeforeAuth")
      if (url) {
        window.location.href = url
        window.sessionStorage.removeItem("urlBeforeAuth")
      }
      if (success) {
        this.auth.rerender(profile)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async login(e: Event) {
    e.preventDefault()
    try {
      const { success } = await api.getProfile()
      window.sessionStorage.setItem("urlBeforeAuth", window.location.href)
      success
        ? (window.location.href = this.auth.logoutUrl)
        : (window.location.href = this.auth.loginUrl)
    } catch (err) {
      console.log(err)
    }
  }
}
