import {Profile} from "../services/api"
export function renderProfile(profile: Profile) {
  const name = document.querySelector(".auth-google__username")
  name.innerHTML = profile.name
  const button = document.querySelector(".btn-google-login")
  button.innerHTML = "log out"
}
