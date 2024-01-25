module "crictracker_eks_node_group_role" {
  source = "./terraform-modules/provider/aws/iam_role/v1"
  name   = "crictracker_eks_node_group_role"
  assume_role_policy = jsonencode({
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
    Version = "2012-10-17"
  })
  managed_policy_arns = [
    "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
    "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
    "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
    "arn:aws:iam::aws:policy/AmazonRoute53FullAccess",
  ]
}

module "crictracker_eks_node_group_default" {
  source       = "./terraform-modules/provider/aws/eks_node_group/v1"
  cluster_name = module.crictracker_eks_cluster.eks_cluster_name

  node_group_name = "crictracker_eks_node_group_default"
  node_role_arn   = module.crictracker_eks_node_group_role.iam_role_arn

  subnet_ids = [
    "${module.crictracker_private_subnet_az_a.subnet_id}",
    "${module.crictracker_private_subnet_az_b.subnet_id}",
    "${module.crictracker_private_subnet_az_c.subnet_id}"
  ]

  ami_type  = "AL2_x86_64" #Default : AL2_x86_64
  disk_size = 50           # Default: 20Gb
  instance_types = ["t3a.medium"]  #List of instance types
  capacity_type = "ON_DEMAND" # values: ON_DEMAND, SPOT

  # Scaling_config
  desired_size = 3 #Must be at least 1 for coredns to work
  max_size     = 10
  min_size     = 1 #Must be at least 1 for coredns to work


  # Addons part (optional) check supported version by cluster
  # aws eks describe-addon-version --addon-name <addon name>
  # remove when you copy this module to generate other node group.
  addon_create_vpc_cni  = true
  addon_vpc_cni_version = "v1.10.2-eksbuild.1"

  addon_create_kube_proxy  = true
  addon_kube_proxy_version = "v1.21.2-eksbuild.2"

  # change to true after creation of one node
  addon_create_coredns  = true
  addon_coredns_version = "v1.8.4-eksbuild.1"

  tags = {
    Name : "crictracker_eks_node_group_default",
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
    "k8s.io/cluster-autoscaler/enabled" : "TRUE",
    "k8s.io/cluster-autoscaler/crictracker" : "owned",
  }
}

# module "crictracker_eks_node_group_default_a" {
#   source       = "./terraform-modules/provider/aws/eks_node_group/v1"
#   cluster_name = module.crictracker_eks_cluster.eks_cluster_name

#   node_group_name = "crictracker_eks_node_group_default_a"
#   node_role_arn   = module.crictracker_eks_node_group_role.iam_role_arn

#   subnet_ids = [
#     "${module.crictracker_private_subnet_az_a.subnet_id}",
#   ]

#   ami_type  = "AL2_x86_64" #Default : AL2_x86_64
#   disk_size = 50           # Default: 20Gb
#   instance_types = ["t3a.medium"]  #List of instance types  default is t3.meduim
#   capacity_type = "ON_DEMAND" # values: ON_DEMAND, SPOT

#   # Scaling_config
#   desired_size = 2 #Must be at least 1 for coredns to work
#   max_size     = 10
#   min_size     = 1 #Must be at least 1 for coredns to work
  
#   labels = { 
#     pv: "monitoring-az-a",
#     redis-pv: "local-dev",
#   }
#   tags = {
#     Name : "crictracker_eks_node_group_default_a",
#     Author : "Terraform",
#     Contact : var.contact,
#     Environment : var.environment,
#     "k8s.io/cluster-autoscaler/enabled" : "TRUE",
#     "k8s.io/cluster-autoscaler/crictracker" : "owned",
#   }
# }


module "crictracker_eks_node_group_default_a_m5a_xlarge" {
  source       = "./terraform-modules/provider/aws/eks_node_group/v1"
  cluster_name = module.crictracker_eks_cluster.eks_cluster_name

  node_group_name = "crictracker_eks_node_group_default_a_m5a_xlarge"
  node_role_arn   = module.crictracker_eks_node_group_role.iam_role_arn

  subnet_ids = [
    "${module.crictracker_private_subnet_az_a.subnet_id}",
  ]

  ami_type  = "AL2_x86_64" #Default : AL2_x86_64
  disk_size = 50           # Default: 20Gb
  instance_types = ["m5a.xlarge"]  #List of instance types  default is t3.meduim
  capacity_type = "ON_DEMAND" # values: ON_DEMAND, SPOT

  # Scaling_config
  desired_size = 2 #Must be at least 1 for coredns to work
  max_size     = 10
  min_size     = 1 #Must be at least 1 for coredns to work
  
  labels = { 
    pv: "monitoring-az-a",
    redis-pv: "local-dev",
    redis-pv-dev: "dev",
  }
  tags = {
    Name : "crictracker_eks_node_group_default_a_m5a_xlarge",
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
    "k8s.io/cluster-autoscaler/enabled" : "TRUE",
    "k8s.io/cluster-autoscaler/crictracker" : "owned",
  }
}


# module "crictracker_eks_node_group_default_b" {
#   source       = "./terraform-modules/provider/aws/eks_node_group/v1"
#   cluster_name = module.crictracker_eks_cluster.eks_cluster_name

#   node_group_name = "crictracker_eks_node_group_default_b"
#   node_role_arn   = module.crictracker_eks_node_group_role.iam_role_arn

#   subnet_ids = [
#     "${module.crictracker_private_subnet_az_b.subnet_id}",
#   ]

#   ami_type  = "AL2_x86_64" #Default : AL2_x86_64
#   disk_size = 50           # Default: 20Gb
#   instance_types = ["t3a.medium"]  #List of instance types  default is t3.meduim
#   capacity_type = "ON_DEMAND" # values: ON_DEMAND, SPOT

#   # Scaling_config
#   desired_size = 2 #Must be at least 1 for coredns to work
#   max_size     = 10
#   min_size     = 1 #Must be at least 1 for coredns to work
  
#   labels = { 
#     elk-pv: "monitoring-az-b",
#   }
#   tags = {
#     Name : "crictracker_eks_node_group_default_a",
#     Author : "Terraform",
#     Contact : var.contact,
#     Environment : var.environment,
#     "k8s.io/cluster-autoscaler/enabled" : "TRUE",
#     "k8s.io/cluster-autoscaler/crictracker" : "owned",
#   }
# }


module "crictracker_eks_node_group_default_b_m5a_xlarge" {
  source       = "./terraform-modules/provider/aws/eks_node_group/v1"
  cluster_name = module.crictracker_eks_cluster.eks_cluster_name

  node_group_name = "crictracker_eks_node_group_default_b_m5a_xlarge"
  node_role_arn   = module.crictracker_eks_node_group_role.iam_role_arn

  subnet_ids = [
    "${module.crictracker_private_subnet_az_b.subnet_id}",
  ]

  ami_type  = "AL2_x86_64" #Default : AL2_x86_64
  disk_size = 50           # Default: 20Gb
  instance_types = ["m5a.large"]  #List of instance types  default is t3.meduim
  capacity_type = "ON_DEMAND" # values: ON_DEMAND, SPOT

  # Scaling_config
  desired_size = 2 #Must be at least 1 for coredns to work
  max_size     = 10
  min_size     = 1 #Must be at least 1 for coredns to work
  
  labels = { 
    elk-pv: "monitoring-az-b",
  }
  tags = {
    Name : "crictracker_eks_node_group_default_b_m5a_xlarge",
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
    "k8s.io/cluster-autoscaler/enabled" : "TRUE",
    "k8s.io/cluster-autoscaler/crictracker" : "owned",
  }
}


module "crictracker_eks_node_group_default_c_m5a_xlarge" {
  source       = "./terraform-modules/provider/aws/eks_node_group/v1"
  cluster_name = module.crictracker_eks_cluster.eks_cluster_name

  node_group_name = "crictracker_eks_node_group_default_c_m5a_xlarge"
  node_role_arn   = module.crictracker_eks_node_group_role.iam_role_arn

  subnet_ids = [
    "${module.crictracker_private_subnet_az_c.subnet_id}",
  ]

  ami_type  = "AL2_x86_64" #Default : AL2_x86_64
  disk_size = 50           # Default: 20Gb
  instance_types = ["m5a.large"]  #List of instance types  default is t3.meduim
  capacity_type = "ON_DEMAND" # values: ON_DEMAND, SPOT

  # Scaling_config
  desired_size = 2 #Must be at least 1 for coredns to work
  max_size     = 10
  min_size     = 1 #Must be at least 1 for coredns to work
  
  # labels = { 
  #   elk-pv: "monitoring-az-b",
  # }
  tags = {
    Name : "crictracker_eks_node_group_default_c_m5a_xlarge",
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
    "k8s.io/cluster-autoscaler/enabled" : "TRUE",
    "k8s.io/cluster-autoscaler/crictracker" : "owned",
  }
}

module "crictracker_eks_node_group_mongodb-local-dev" {
  source       = "./terraform-modules/provider/aws/eks_node_group/v1"
  cluster_name = module.crictracker_eks_cluster.eks_cluster_name

  node_group_name = "crictracker_eks_node_group_mongodb-local-dev"
  node_role_arn   = module.crictracker_eks_node_group_role.iam_role_arn

  subnet_ids = [
    "${module.crictracker_private_subnet_az_b.subnet_id}",
  ]

  ami_type  = "AL2_x86_64" #Default : AL2_x86_64
  disk_size = 50           # Default: 20Gb
  instance_types = ["r5a.xlarge"]  #List of instance types  default is t3.meduim
  capacity_type = "ON_DEMAND" # values: ON_DEMAND, SPOT

  # Scaling_config
  desired_size = 2 #Must be at least 1 for coredns to work
  max_size     = 10
  min_size     = 1 #Must be at least 1 for coredns to work
  
  labels = { 
    mongodb-pv: "local-dev-subnet-b",
  }
  tags = {
    Name : "crictracker_eks_node_group_mongodb-local-dev",
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
    "k8s.io/cluster-autoscaler/enabled" : "TRUE",
    "k8s.io/cluster-autoscaler/crictracker" : "owned",
  }
}