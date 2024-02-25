import B2 from "backblaze-b2";

const applicationKeyId = process.env.B2_APPLICATION_KEY_ID;
const applicationKey = process.env.B2_APPLICATION_KEY;

let b2: B2;

const connectB2 = async () => {
  if (b2) {
    return b2;
  }

  try {
    const connection = new B2({
      applicationKeyId,
      applicationKey,
    });
    await connection.authorize();
    b2 = connection;
    return b2;
  } catch (error) {
    console.error("Failed to connect to B2:", error);
    throw error;
  }
};

export default connectB2;
