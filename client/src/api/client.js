export async function get(endpoint) {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
        const err = new Error("Not 2xx response");
        err.response = response;
        throw err;
    } else {
        return await response.json();
    }

}

export async function post(endpoint, data) {
  const response = await fetch(endpoint, {
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
  const response = await fetch(endpoint, {
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

export async function put(endpoint,data) {
  console.log("Calling Put")
  const response = await fetch(endpoint, {
    method: "PUT",
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


