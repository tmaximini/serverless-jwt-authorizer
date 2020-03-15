# Serverless functions with custom JWT authorizer

This example demonstrates how to implement a custom JWT based authorizer to protect your serverless APIs on AWS Lambda.

[Blog post](https://www.thomasmaximini.com/blog/jwt-authorization-for-serverless-apis-on-aws-lambda)

DynamoDB is used as a data store to persist user records.

Each file in `./functions/` is a seperate lambda api endpoint.
Check `serverless.yml` for configuration.

> Follow me on Twitter at [@tmaximini](https://twitter.com/tmaximini)
