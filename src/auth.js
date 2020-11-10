function init() {
  const el = document.getElementById("auth-btn");
  el ? el.addEventListener("click", loginPopupOpen) : "";

  const closeButton = document.getElementById("login-popup-close");
  closeButton ? closeButton.addEventListener("click", loginPopupClose) : "";

  const loginButton = document.getElementById("login-request");
  loginButton ? loginButton.addEventListener("click", loginRequest) : "";
}

const loginPopupOpen = () => {
  const modal = document.getElementById("login-popup");
  modal ? (modal.style.display = "block") : "";
};

const loginPopupClose = () => {
  const modalEl = document.getElementById("login-popup");
  modalEl ? (modalEl.style.display = "none") : "";
};

const loginRequest = () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const data = {
    identifier: email,
    password: password,
  };
  postData("http://localhost:1337/auth/local", data)
    .then((data) => data.json())
    .then((res) => {
      if (res.error) {
        // { пример ответа с ошибкой
        //     "statusCode": 400,
        //     "error": "Bad Request",
        //     "message": [
        //         {
        //             "messages": [
        //                 {
        //                     "id": "Auth.form.error.invalid",
        //                     "message": "Identifier or password invalid."
        //                 }
        //             ]
        //         }
        //     ],
        //     "data": [
        //         {
        //             "messages": [
        //                 {
        //                     "id": "Auth.form.error.invalid",
        //                     "message": "Identifier or password invalid."
        //                 }
        //             ]
        //         }
        //     ]
        // }
        return console.log("ERROR: ", res.error);
      }

    //   { Успешная авторизация
    //     "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjA1MDI3NTU3LCJleHAiOjE2MDc2MTk1NTd9.aK9-il6Z9t4GztcPsnOLqhq1RWeyueMjKqmJPLNxZTE",
    //     "user": {
    //         "id": 2,
    //         "username": "test",
    //         "email": "ava_vladimir2@mail.ru",
    //         "provider": "local",
    //         "confirmed": false,
    //         "blocked": false,
    //         "role": {
    //             "id": 3,
    //             "name": "vladimir",
    //             "description": "Content manager",
    //             "type": "vladimir"
    //         },
    //         "created_at": "2020-11-10T11:33:33.594Z",
    //         "updated_at": "2020-11-10T11:35:58.567Z"
    //     }
    // }
      console.log('JWT:', res.jwt)
      //сохранить jwt

      //помещать в header
    });
};

const postData = async (url = "", data = {}) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    body: await JSON.stringify(data),
  });
  return res;
};

export const auth = {
  init,
};
