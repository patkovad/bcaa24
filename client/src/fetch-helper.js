async function Call(baseUri, useCase, dtoIn, method) {
    // return fetch
    let response;
    if (!method || method === "get") {
      response = await fetch(
        `${baseUri}/${useCase}${
          dtoIn && Object.keys(dtoIn).length
            ? `?${new URLSearchParams(dtoIn)}`
            : ""
        }`
      );
    } else {
      response = await fetch(`${baseUri}/${useCase}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dtoIn),
      });
    }
    const data = await response.json();
    return { ok: response.ok, status: response.status, data };
  }
  
  const baseUri = "http://localhost:3000";
  
  const FetchHelper = {
    task: {
      get: async (dtoIn) => {
        return await Call(baseUri, "task/get", dtoIn, "get");
      },
      create: async (dtoIn) => {
        return await Call(baseUri, "task/create", dtoIn, "post");
      },
      update: async (dtoIn) => {
        return await Call(baseUri, "task/update", dtoIn, "post");
      },
      delete: async (dtoIn) => {
        return await Call(baseUri, "task/delete", dtoIn, "post");
      },
      list: async (dtoIn) => {
        return await Call(baseUri, "task/list", dtoIn, "get");
      },
    },
  
    status: {
      get: async (dtoIn) => {
        return await Call(baseUri, "status/get", dtoIn, "get");
      },
      create: async (dtoIn) => {
        return await Call(baseUri, "status/create", dtoIn, "post");
      },
      update: async (dtoIn) => {
        return await Call(baseUri, "status/update", dtoIn, "post");
      },
      delete: async (dtoIn) => {
        return await Call(baseUri, "status/delete", dtoIn, "post");
      },
      list: async () => {
        return await Call(baseUri, "status/list", null, "get");
      },
    },
  };
  
  export default FetchHelper;