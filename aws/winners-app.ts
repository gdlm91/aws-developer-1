#!/usr/bin/env node
import "source-map-support/register";
import * as Core from "@aws-cdk/core";

import { WinnersStack } from "./winners-stack";

const app = new Core.App();

new WinnersStack(app, "WinnerStack");

app.synth();
