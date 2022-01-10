const baseUrl = "http://localhost:9000"

export async function get(endpoint) {
    const response = await fetch(baseUrl + endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
        // make the promise be rejected if we didn't get a 2xx response
        const err = new Error("Not 2xx response");
        err.response = response;
        throw err;
    } else {
        return await response.json();
    }

}

export async function post(endpoint, data) {
  const response = await fetch(baseUrl + endpoint, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
      // make the promise be rejected if we didn't get a 2xx response
      const err = new Error("Not 2xx response");
      err.response = response;
      throw err;
  } else {
      return await response.json();
  }

}

export async function del(endpoint) {
  const response = await fetch(baseUrl + endpoint, {
    method: "DELETE",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
      // make the promise be rejected if we didn't get a 2xx response
      const err = new Error("Not 2xx response");
      err.response = response;
      throw err;
  } else {
      return await response.json();
  }

}


