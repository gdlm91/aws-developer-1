import * as Core from "@aws-cdk/core";

import { WinnerService } from "./winner-service";

export class WinnerStack extends Core.Stack {
  constructor(scope: Core.Construct, id: string, props?: Core.StackProps) {
    super(scope, id, props);

    new WinnerService(this, "WinnerService");
  }
}
