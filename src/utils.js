export const postData = async (url = "", data = {}) => {
    const res = await fetch(url, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      body: JSON.stringify(data),
    });
    return res;
  };

