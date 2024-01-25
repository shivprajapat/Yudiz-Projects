provider "aws" {
  shared_credentials_file = ".aws/credentials"
  profile                 = "ct_aman"
  region                  = var.aws_region
}

# locals {
#   # Your AWS EKS Cluster ID goes here.
#   k8s_cluster_name = module.crictracker_eks_cluster.eks_cluster_name
# }

data "aws_region" "current" {}

# data "aws_eks_cluster" "target" {
#   name = local.k8s_cluster_name
# }

# data "aws_eks_cluster_auth" "aws_iam_authenticator" {
#   name = data.aws_eks_cluster.target.name
# }

# provider "kubernetes" {
#   alias                  = "eks"
#   host                   = data.aws_eks_cluster.target.endpoint
#   cluster_ca_certificate = base64decode(data.aws_eks_cluster.target.certificate_authority[0].data)
#   token                  = data.aws_eks_cluster_auth.aws_iam_authenticator.token
#   #   load_config_file       = false
# }

# provider "helm" {
#   alias = "eks"
#   kubernetes {
#     host                   = data.aws_eks_cluster.target.endpoint
#     token                  = data.aws_eks_cluster_auth.aws_iam_authenticator.token
#     cluster_ca_certificate = base64decode(data.aws_eks_cluster.target.certificate_authority[0].data)
#   }
# }
