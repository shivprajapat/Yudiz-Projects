module "crictracker_elasticache_subnet_group" {
  source = "./terraform-modules/provider/aws/elasticache_subnet_group/v1"
  name   = "crictracker"
  subnet_ids = [
    "${module.crictracker_private_subnet_az_a.subnet_id}",
    "${module.crictracker_private_subnet_az_b.subnet_id}",
    "${module.crictracker_private_subnet_az_c.subnet_id}"
  ]
  description = "Elasticache Subnet group for Redis Read replica"
}

module "crictracker_elasticache_redis_security_group" {
  source      = "./terraform-modules/provider/aws/security_group/v1"
  name        = "elasticache_redis_security_group"
  description = "Security Group for Elacticache Redis"
  vpc_id      = module.crictracker_vpc.vpc_id
  ingress_rules = [
    {
      from     = 6379
      to       = 6379
      protocol = "TCP"
      cidr = [
        module.crictracker_private_subnet_az_a.subnet_cidr_block,
        module.crictracker_private_subnet_az_b.subnet_cidr_block,
        module.crictracker_private_subnet_az_c.subnet_cidr_block
      ]
    }
  ]

  tags = {
    Name : "elasticache_redis_security_group"
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
    Purpose : "k8s pods can access redis DB"
  }
}

module "crictracker_elasticache_parameter_group" {
  source = "./terraform-modules/provider/aws/elasticache_parameter_group/v1"
  name   = "crictracker-paramater-group"
  description = "Elasticache parameter group for Redis"
  family = "redis6.x"
}

# module "crictracker_redis_cluster" {
#   source                        = "./terraform-modules/provider/aws/elasticache"
#   replication_enabled           = false
#   engine                        = "redis"
#   # replication_group_id          = "crictracker-redis-replica"
#   # replication_group_description = "crictracker Redis replica"
#   node_type                     = "cache.t2.micro"
#   security_group_ids            = ["${module.crictracker_elasticache_redis_security_group.security_group_id}"]
#   apply_immediately             = false # by default apply immedialtly is remain to false.
#   subnet_group_name             = module.crictracker_elasticache_subnet_group.elasticache_subnet_group_name
#   availability_zones = [
#     "${module.crictracker_private_subnet_az_a.subnet_availability_zone}",
#     "${module.crictracker_private_subnet_az_b.subnet_availability_zone}",
#     "${module.crictracker_private_subnet_az_c.subnet_availability_zone}"
#   ]
#   parameter_group_name = module.crictracker_elasticache_parameter_group.elasticache_parameter_group_name
#   number_cache_clusters = 2
# }


# module "crictracker_redis_cluster_demo" {
#   source                        = "./terraform-modules/provider/aws/elasticache"
#   replication_enabled           = false
#   engine                        = "redis"
#   replication_group_id          = "crictracker-redis"
#   replication_group_description = "crictracker Redis"
#   node_type                     = "cache.t2.micro"
#   security_group_ids            = ["${module.crictracker_elasticache_redis_security_group.security_group_id}"]
#   apply_immediately             = false # by default apply immedialtly is remain to false.
#   subnet_group_name             = module.crictracker_elasticache_subnet_group.elasticache_subnet_group_name
#   availability_zones = [
#     "${module.crictracker_private_subnet_az_a.subnet_availability_zone}",
#     "${module.crictracker_private_subnet_az_b.subnet_availability_zone}",
#     "${module.crictracker_private_subnet_az_c.subnet_availability_zone}"
#   ]
#   parameter_group_name = module.crictracker_elasticache_parameter_group.elasticache_parameter_group_name
#   number_cache_clusters = 2
#   at_rest_encryption_enabled    = false
#   transit_encryption_enabled    = false
# }

module "aws_elasticache_replication_group" {
  source                        = "./terraform-modules/provider/aws/elasticache"
  engine                        = "redis"
  replication_group_id          = "crictracker-redis-fosdihfksd"
  replication_group_description = "crictracker-redis-fdsfsdfsdsfsd"
  engine_version                = "6.2"
  port                          = "6379"
  parameter_group_name          = module.crictracker_elasticache_parameter_group.elasticache_parameter_group_name
  node_type                     = "cache.t2.micro"
  automatic_failover_enabled    = false
  subnet_group_name             = module.crictracker_elasticache_subnet_group.elasticache_subnet_group_name
  security_group_ids            = ["${module.crictracker_elasticache_redis_security_group.security_group_id}"]
  apply_immediately             = false
  availability_zones = [
    "${module.crictracker_private_subnet_az_a.subnet_availability_zone}",
    "${module.crictracker_private_subnet_az_b.subnet_availability_zone}",
    "${module.crictracker_private_subnet_az_c.subnet_availability_zone}"
  ]
  number_cache_clusters         = 5
  auto_minor_version_upgrade    = false
  at_rest_encryption_enabled    = false
  transit_encryption_enabled    = false
  # auth_token                    = "${var.auth_token}"
  tags = {
    Name : "elasticache_redis_security_group"
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
    Purpose : "k8s pods can access redis DB"
  }
}