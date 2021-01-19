module.exports = {
  HEADER_TITLE: "Change mind",
  SITE_TITLE: "Personal site Avakumov Vladimir",
  LOGIN_BTN: "login",

  CURRENT_TAG_ID: "admin-current-tag",
  SLIDES_ID: "container-slide",
  CLI_ID: "admin-cli",
  TAGS_ID: "admin-tags-notes",
  CONTENT_ID: "content",
  URL_API:
    process.env.NODE_ENV === "production"
      ? "http://avakumov.ru:3001/api"
      : "http://localhost:3001/api",
}
