import * as cdk from 'aws-cdk-lib';
import { ClusterStack } from '../lib/eks-cluster-stack';
import { readYamlFromDir } from '../utils/read-file';
import { Construct } from 'constructs';
import { EksProps } from './eks-cluster-stack'; 

export class ContainerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EksProps) {
    super(scope, id, props);
    
    const cluster = props.cluster;
    const commonFolder = './yaml-common/';
    const regionFolder = `./yaml-${cdk.Stack.of(this).region}/`;

    readYamlFromDir(commonFolder, cluster);
    readYamlFromDir(regionFolder, cluster);

    
  }

}


