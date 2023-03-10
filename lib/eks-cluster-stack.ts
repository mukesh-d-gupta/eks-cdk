import * as cdk from 'aws-cdk-lib';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { PhysicalName } from 'aws-cdk-lib';

export class ClusterStack  extends cdk.Stack {
   public readonly cluster: eks.Cluster;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const clusterAdmin = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal()
      });
    
    const primaryRegion = 'ap-southeast-2';
    
    const cluster = new eks.Cluster(this, 'demogo-cluster', {
        clusterName: `demogo`,
        mastersRole: clusterAdmin,
        version: eks.KubernetesVersion.V1_24,
        defaultCapacity: 3,
        defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.SMALL)
      });

    // cluster.addAutoScalingGroupCapacity('spot-group', {
    //   instanceType: new ec2.InstanceType('t3.small'),
    //   spotPrice: cdk.Stack.of(this).region==primaryRegion ? '0.0110' : '0.080'
    //   });
      cluster.addAutoScalingGroupCapacity('spot-group', {
        instanceType: new ec2.InstanceType('m5.large'),
         minCapacity: 2,
         machineImageType: eks.MachineImageType.BOTTLEROCKET,
        spotPrice: cdk.Stack.of(this).region==primaryRegion ? '0.040' : '0.360'
      });
      
        this.cluster = cluster;

  }
}

function createDeployRole(scope: Construct, id: string, cluster: eks.Cluster): iam.Role {
  const role = new iam.Role(scope, id, {
    roleName: PhysicalName.GENERATE_IF_NEEDED,
    assumedBy: new iam.AccountRootPrincipal()
  });
  
 cluster.awsAuth.addMastersRole(role);

  return role;
}

export interface EksProps extends cdk.StackProps {
  cluster: eks.Cluster
}
