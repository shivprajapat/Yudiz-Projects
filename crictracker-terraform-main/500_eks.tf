module "crictracker_eks_cluster_role" {
  source = "./terraform-modules/provider/aws/iam_role/v1"
  name   = "crictracker_eks_cluster_role"
  assume_role_policy = jsonencode({
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "eks.amazonaws.com"
      }
    }]
    Version = "2012-10-17"
  })
  managed_policy_arns = [
    "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
    "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
    "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
    "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
    "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController"
  ]
}

module "crictracker_eks_cluster" {
  source   = "./terraform-modules/provider/aws/eks_cluster/v1"
  name     = "crictracker"
  role_arn = module.crictracker_eks_cluster_role.iam_role_arn
  subnet_ids = [
    "${module.crictracker_public_subnet_az_a.subnet_id}",
    "${module.crictracker_public_subnet_az_b.subnet_id}",
    "${module.crictracker_public_subnet_az_c.subnet_id}",
    "${module.crictracker_private_subnet_az_a.subnet_id}",
    "${module.crictracker_private_subnet_az_c.subnet_id}",
    "${module.crictracker_private_subnet_az_b.subnet_id}"
  ]

  endpoint_private_access = true
  endpoint_public_access  = true
}
