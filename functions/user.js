const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { getUserByEmail, createDbUser } = require("../lib/db");

/*
 * Functions
 */
const signIn = async event => {
  const body = JSON.parse(event.body);

  return login(body)
    .then(session => ({
      statusCode: 200,
      body: JSON.stringify(session)
    }))
    .catch(err => {
      console.log({ err });

      return {
        statusCode: err.statusCode || 500,
        headers: { "Content-Type": "text/plain" },
        body: { stack: err.stack, message: err.message }
      };
    });
};

const registerUser = async event => {
  const body = JSON.parse(event.body);

  return createDbUser(body)
    .then(user => ({
      statusCode: 200,
      body: JSON.stringify(user)
    }))
    .catch(err => {
      console.log({ err });

      return {
        statusCode: err.statusCode || 500,
        headers: { "Content-Type": "text/plain" },
        body: { stack: err.stack, message: err.message }
      };
    });
};

const me = async event => {
  const userObj = await getUserFromToken(event.headers.Authorization);

  const dbUser = await getUserByEmail(userObj.email);

  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify(dbUser)
  };
};

/**
 * Helpers
 */
async function signToken(user) {
  const secret = Buffer.from(process.env.JWT_SECRET, "base64");

  return jwt.sign({ email: user.email, id: user.id, roles: ["USER"] }, secret, {
    expiresIn: 86400 // expires in 24 hours
  });
}

async function getUserFromToken(token) {
  const secret = Buffer.from(process.env.JWT_SECRET, "base64");

  const decoded = jwt.verify(token.replace("Bearer ", ""), secret);

  return decoded;
}

async function login(args) {
  try {
    const user = await getUserByEmail(args.email);

    const isValidPassword = await comparePassword(
      args.password,
      user.passwordHash
    );

    if (isValidPassword) {
      const token = await signToken(user);
      return Promise.resolve({ auth: true, token: token, status: "SUCCESS" });
    }
  } catch (err) {
    console.info("Error login", err);
    return Promise.reject(new Error(err));
  }
}

function comparePassword(eventPassword, userPassword) {
  return bcrypt.compare(eventPassword, userPassword);
}

module.exports = {
  signIn,
  registerUser,
  me
};
