#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ClusterStack } from '../lib/eks-cluster-stack';
import { ContainerStack } from '../lib/container-stack';


const app = new cdk.App();

const account = app.node.tryGetContext('account') || process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT;
const primaryRegion = {account: account, region: 'ap-southeast-2'};

const primaryCluster = new ClusterStack(app, `ClusterStack-${primaryRegion.region}`, {env: primaryRegion })
new ContainerStack(app, `ContainerStack-${primaryRegion.region}`, {env: primaryRegion, cluster: primaryCluster.cluster });