import * as Core from "@aws-cdk/core";
import * as ApiGateway from "@aws-cdk/aws-apigateway";
import * as Lambda from "@aws-cdk/aws-lambda";

export class WinnerService extends Core.Construct {
  constructor(scope: Core.Construct, id: string) {
    super(scope, id);

    const apiGateway = new ApiGateway.RestApi(this, "winner-api", {
      restApiName: "Winner Service",
      description:
        "Returns a given number of winners from a given list of participants",
    });

    const lambda = new Lambda.Function(this, "winner-lambda", {
      runtime: Lambda.Runtime.NODEJS_10_X, // To run async
      code: Lambda.Code.fromAsset("resources"),
      handler: "winner-lambda.handler",
    });

    const getWinnerIntegration = new ApiGateway.LambdaIntegration(lambda, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' },
    });

    apiGateway.root.addMethod("GET", getWinnerIntegration); // GET "/" method
  }
}
