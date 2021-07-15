// Based on: https://github.com/aws-samples/aws-cdk-examples/tree/master/typescript/api-cors-lambda-crud-dynamodb

import * as Core from "@aws-cdk/core";
import * as ApiGateway from "@aws-cdk/aws-apigateway";
import * as Lambda from "@aws-cdk/aws-lambda";

export class WinnersStack extends Core.Stack {
  constructor(scope: Core.Construct, id: string, props?: Core.StackProps) {
    super(scope, id, props);

    // Lambdas
    const lambdaProps: Lambda.FunctionProps = {
      runtime: Lambda.Runtime.NODEJS_14_X,
      code: Lambda.Code.fromAsset("dist/handlers"),
      handler: "placeholder", // will be provided by the Functions
    };

    const getWinnersLambda = new Lambda.Function(this, "get-winners-lambda", {
      ...lambdaProps,
      handler: "get-winners.handler",
    });

    const postWinnersLambda = new Lambda.Function(this, "post-winners-lambda", {
      ...lambdaProps,
      handler: "post-winners.handler",
    });

    const getWinnersIntegration = new ApiGateway.LambdaIntegration(
      getWinnersLambda
    );

    const postWinnersIntegration = new ApiGateway.LambdaIntegration(
      postWinnersLambda
    );

    // API Gateway

    const apiGateway = new ApiGateway.RestApi(this, "winner-api", {
      restApiName: "Winner Service",
      description:
        "Returns a given number of winners from a given list of participants",
    });

    apiGateway.root.addMethod("GET", getWinnersIntegration); // GET "/" method
    apiGateway.root.addMethod("POST", postWinnersIntegration); // POST "/" method
  }
}
