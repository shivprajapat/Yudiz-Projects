#third party dependecies we are not using this because the updated version of ALB controller version is not updated.
module "alb_ingress_controller" {
  source  = "iplabs/alb-ingress-controller/kubernetes"
  version = "3.4.0"

  depends_on = [
    module.fantasy_eks_cluster
  ]

  providers = {
    kubernetes = kubernetes.eks
  }

  k8s_cluster_type = "eks"
  k8s_namespace    = "kube-system"

  aws_region_name  = data.aws_region.current.name
  k8s_cluster_name = data.aws_eks_cluster.target.name
}