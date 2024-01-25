module "crictracker_rds_subnet_group" {
  source = "./terraform-modules/provider/aws/db_subnet_group/v1"

  name = "crictracker_rds_subnet_group"
  subnet_ids = [
    "${module.crictracker_private_subnet_az_a.subnet_id}",
    "${module.crictracker_private_subnet_az_b.subnet_id}",
    "${module.crictracker_private_subnet_az_c.subnet_id}"
  ]
}

module "crictracker_rds_parameter_group" {
  source      = "./terraform-modules/provider/aws/db_parameter_group/v1"
  name        = "crictracker-rds-parameter-group"
  description = "Parameter group for crictracker RDS"
  family      = "mysql8.0"
}


module "crictracker_rds_security_group" {
  source      = "./terraform-modules/provider/aws/security_group/v1"
  name        = "crictracker_security_group"
  vpc_id      = module.crictracker_vpc.vpc_id
  description = "Private connectivity to RDS DBs"
  ingress_rules = [
    {
      from     = 3306
      to       = 3306
      protocol = "TCP"
      cidr = [
        module.crictracker_private_subnet_az_a.subnet_cidr_block,
        module.crictracker_private_subnet_az_b.subnet_cidr_block,
        module.crictracker_private_subnet_az_c.subnet_cidr_block
      ]

    }
  ]
  tags = {
    Name : "crictracker_security_group"
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
    Purpose : "k8s pods can access rds instance"
  }
}

module "crictracker_rds_monitoring_role" {
  source = "./terraform-modules/provider/aws/iam_role/v1"

  name = "rds-monitoring-role"
  assume_role_policy = jsonencode({
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "monitoring.rds.amazonaws.com"
      }
    }]
    Version = "2012-10-17"
  })
  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole",
  ]
}

module "crictracker_rds_mysql" {
  source = "./terraform-modules/provider/aws/db_instance/v1"

  # availability_zone    = "ap-south-1"
  allocated_storage     = "20"
  engine                = "mysql"
  engine_version        = "8.0"
  instance_class        = "db.t2.micro"
  name                  = "crictracker"
  username              = "admin"
  password              = "eZHyYRnAK5RhucCx"
  parameter_group_name  = module.crictracker_rds_parameter_group.db_parameter_group_name
  apply_immediately     = false
  identifier            = "crictracker"
  max_allocated_storage = 1024 # Enter the value if you want to enable storage autoscaling Value must be Minimum 21 GiB and Maximum 65,536 GiB
  # iops = 1000                                     #  Enter the value if you want to go for IOPs based storage class
  multi_az = false # enter value of value of multi az deployment default is false.
  # publicly_accessible = false                        # enter the value if you want your DB to publicly accessible. Defaults is false
  # port = 3307                                         # enter the port of your DB. Defaults is 3306
  db_subnet_group_name                          = module.crictracker_rds_subnet_group.rds_subnet_group_id
  vpc_security_group_ids                        = [module.crictracker_rds_security_group.security_group_id]
  copy_tags_to_snapshot                         = true #Copy all Instance tags to snapshots. Default is true
  performance_insights_enabled                  = false
  monitoring_interval                           = 5 #To disable enter value = 0, Valid Values: 0, 1, 5, 10, 15, 30, 60.
  log_export                                    = true
  enabled_cloudwatch_logs_exports               = {}
  enabled_cloudwatch_logs_exports_mysql_mariaDB = ["audit", "error", "general", "slowquery"]
  backup_retention_period                       = "7"
  auto_minor_version_upgrade                    = false  # remain it in false mode only else itll upgrade and restart the DB instance at any time.
  monitoring_role_arn                           = module.crictracker_rds_monitoring_role.iam_role_arn
  deletion_protection                           = var.rds_deletion_protection # default is true and set to false
  maintenance_window =  "Mon:05:00-Mon:07:00"
  tags = {
    Name: "crictracker",
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
  }
}