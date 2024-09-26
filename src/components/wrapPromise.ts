function wrapPromise<T>(promise: Promise<T>) {
  let status: "pending" | "success" | "error" = "pending";
  let response: T | any;

  const suspender = promise.then(
    (res: T) => {
      status = "success";
      response = res;
    },
    (err: any) => {
      status = "error";
      response = err;
    },
  );

  const handler: { [key: string]: () => T | any } = {
    pending: () => {
      throw suspender;
    },
    error: () => {
      console.log("err");

      throw response;
    },
    default: () => response,
  };

  const read = (): T | any => {
    const result = handler[status] ? handler[status]() : handler.default();
    return result;
  };

  return { read };
}

export default wrapPromise;
