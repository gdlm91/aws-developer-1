#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { WinnerStack } from "../lib/winner-stack";

const app = new cdk.App();

new WinnerStack(app, "WinnerStack");
