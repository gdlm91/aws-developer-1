// Based on: https://github.com/aws-samples/aws-cdk-examples/tree/master/typescript/api-cors-lambda-crud-dynamodb

import * as Core from "@aws-cdk/core";
import * as ApiGateway from "@aws-cdk/aws-apigateway";
import * as Lambda from "@aws-cdk/aws-lambda";
import * as DynamoDB from "@aws-cdk/aws-dynamodb";

export class WinnersStack extends Core.Stack {
  constructor(scope: Core.Construct, id: string, props?: Core.StackProps) {
    super(scope, id, props);

    // DynamoDB
    const dynamoTablePrimaryKey = "challengeID";
    const dynamoTable = new DynamoDB.Table(this, "items", {
      partitionKey: {
        name: dynamoTablePrimaryKey,
        type: DynamoDB.AttributeType.NUMBER,
      },
      tableName: "winners",

      /**
       *  The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
       * the new table, and it will remain in your account until manually deleted. By setting the policy to
       * DESTROY, cdk destroy will delete the table (even if it has data in it)
       */
      removalPolicy: Core.RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    // Lambdas
    const lambdaProps: Lambda.FunctionProps = {
      handler: "placeholder", // will be provided by the Functions
      runtime: Lambda.Runtime.NODEJS_14_X,
      code: Lambda.Code.fromAsset("dist/handlers"),
      environment: {
        PRIMARY_KEY: dynamoTablePrimaryKey,
        TABLE_NAME: dynamoTable.tableName,
      },
    };

    const getWinnersLambda = new Lambda.Function(this, "get-winners-lambda", {
      ...lambdaProps,
      handler: "get-winners.handler",
    });

    const postWinnersLambda = new Lambda.Function(this, "post-winners-lambda", {
      ...lambdaProps,
      handler: "post-winners.handler",
    });

    // API Gateway
    const apiGateway = new ApiGateway.RestApi(this, "winner-api", {
      restApiName: "Winner Service",
      description:
        "Returns a given number of winners from a given list of participants",
    });

    const getWinnersIntegration = new ApiGateway.LambdaIntegration(
      getWinnersLambda
    );
    const postWinnersIntegration = new ApiGateway.LambdaIntegration(
      postWinnersLambda
    );

    // Integrations
    apiGateway.root.addMethod("GET", getWinnersIntegration); // GET "/" method
    apiGateway.root.addMethod("POST", postWinnersIntegration); // POST "/" method

    dynamoTable.grantReadWriteData(getWinnersLambda);
    dynamoTable.grantReadWriteData(postWinnersLambda);
  }
}
