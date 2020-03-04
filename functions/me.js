const { getUserByEmail } = require("../lib/db");
const { getUserFromToken } = require("../lib/utils");

module.exports.handler = async function(event) {
  const userObj = await getUserFromToken(event.headers.Authorization);

  const dbUser = await getUserByEmail(userObj.email);

  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify(dbUser)
  };
};
