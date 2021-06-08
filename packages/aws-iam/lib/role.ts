import { Construct, Resource } from "../../";

export interface RoleProps {}

export interface IRole {
  Type: string;
  Properties: {
    AssumeRolePolicyDocument: any;
    // Description: string;
    Policies: any[];
  };
}

export class Role extends Resource implements IRole {
  public readonly Type = "AWS::IAM::Role";
  public readonly Properties: {
    AssumeRolePolicyDocument: any;
    // Description: string;
    Policies: any[];
  };

  constructor(scope: Construct, id: string, props: RoleProps) {
    super(scope, id);

    this.Properties = {
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: ["lambda.amazonaws.com"],
            },
            Action: ["sts:AssumeRole"],
          },
        ],
      },
      Policies: [],
    };
  }

  public synth() {
    return {
      resources: { Resources: this.synthResource() },
    };
  }
}

// DOCS: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html#cfn-iam-role-assumerolepolicydocument
// EXAMPLE ROLE

// "IamRoleLambdaExecution": {
//       "Type": "AWS::IAM::Role",
//       "Properties": {
//         "AssumeRolePolicyDocument": {
//           "Version": "2012-10-17",
//           "Statement": [
//             {
//               "Effect": "Allow",
//               "Principal": {
//                 "Service": [
//                   "lambda.amazonaws.com"
//                 ]
//               },
//               "Action": [
//                 "sts:AssumeRole"
//               ]
//             }
//           ]
//         },
//         "Policies": [
//           {
//             "PolicyName": {
//               "Fn::Join": [
//                 "-",
//                 [
//                   "flyers",
//                   "dev",
//                   "lambda"
//                 ]
//               ]
//             },
//             "PolicyDocument": {
//               "Version": "2012-10-17",
//               "Statement": [
//                 {
//                   "Effect": "Allow",
//                   "Action": [
//                     "logs:CreateLogStream",
//                     "logs:CreateLogGroup"
//                   ],
//                   "Resource": [
//                     {
//                       "Fn::Sub": "arn:${AWS::Partition}:logs:${AWS::Region}:${AWS::AccountId}:log-group:/aws/lambda/flyers-dev*:*"
//                     }
//                   ]
//                 },
//                 {
//                   "Effect": "Allow",
//                   "Action": [
//                     "logs:PutLogEvents"
//                   ],
//                   "Resource": [
//                     {
//                       "Fn::Sub": "arn:${AWS::Partition}:logs:${AWS::Region}:${AWS::AccountId}:log-group:/aws/lambda/flyers-dev*:*:*"
//                     }
//                   ]
//                 },
//                 {
//                   "Effect": "Allow",
//                   "Action": [
//                     "xray:PutTraceSegments",
//                     "xray:PutTelemetryRecords"
//                   ],
//                   "Resource": [
//                     "*"
//                   ]
//                 }
//               ]
//             }
//           }
//         ],
//         "Path": "/",
//         "RoleName": {
//           "Fn::Join": [
//             "-",
//             [
//               "flyers",
//               "dev",
//               {
//                 "Ref": "AWS::Region"
//               },
//               "lambdaRole"
//             ]
//           ]
//         }
//       }
//     },
