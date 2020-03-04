const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens

function generateAuthResponse(principalId, effect, methodArn) {
  const policyDocument = generatePolicyDocument(effect, methodArn);

  return {
    principalId,
    policyDocument
  };
}

function generatePolicyDocument(effect, methodArn) {
  if (!effect || !methodArn) return null;

  const policyDocument = {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: methodArn
      }
    ]
  };

  return policyDocument;
}

module.exports.handler = function verifyToken(event, context, callback) {
  const token = event.authorizationToken.replace("Bearer ", "");
  const methodArn = event.methodArn;

  if (!token || !methodArn) return callback(null, "Unauthorized");

  const secret = Buffer.from(process.env.JWT_SECRET, "base64");

  // verifies token
  const decoded = jwt.verify(token, secret);

  if (decoded && decoded.id) {
    return callback(null, generateAuthResponse(decoded.id, "Allow", methodArn));
  } else {
    return callback(null, generateAuthResponse(decoded.id, "Deny", methodArn));
  }
};
