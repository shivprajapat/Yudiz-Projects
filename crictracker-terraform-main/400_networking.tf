# Create VPC
module "crictracker_vpc" {
  source     = "./terraform-modules/provider/aws/vpc/v1"
  cidr_block = "10.0.0.0/16"
  tags = {
    Name : "crictracker",
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
  }
}

#Create Internet Gateway
module "crictracker_internet_gateway" {
  source = "./terraform-modules/provider/aws/internet_gateway/v1"
  vpc_id = module.crictracker_vpc.vpc_id
  tags = {
    Name : "crictracker",
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
  }
}

#Create Elastic IP
module "crictracker_eip_az_a" {
  source     = "./terraform-modules/provider/aws/elastic_ip/v1"
  depends_on = [module.crictracker_internet_gateway]
  tags = {
    Name : "crictracker-az-a",
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
  }
}

# module "crictracker_eip_az_b" {
#   source     = "./terraform-modules/provider/aws/elastic_ip/v1"
#   depends_on = [module.crictracker_internet_gateway]
#   tags = {
#     Name : "crictracker-az-b",
#     Author : "Terraform",
#     Contact : var.contact,
#     Environment : var.environment,
#   }
# }

# module "crictracker_eip_az_c" {
#   source     = "./terraform-modules/provider/aws/elastic_ip/v1"
#   depends_on = [module.crictracker_internet_gateway]
#   tags = {
#     Name : "crictracker-az-c",
#     Author : "Terraform",
#     Contact : var.contact,
#     Environment : var.environment,
#   }
# }

# Create public subnets
module "crictracker_public_subnet_az_a" {
  source            = "./terraform-modules/provider/aws/subnet/v1"
  vpc_id            = module.crictracker_vpc.vpc_id
  cidr_block        = "10.0.255.0/24"
  availability_zone = "ap-south-1a"
  tags = {
    Name : "crictracker-Public-az-a",
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
  }
}

module "crictracker_public_subnet_az_b" {
  source            = "./terraform-modules/provider/aws/subnet/v1"
  vpc_id            = module.crictracker_vpc.vpc_id
  cidr_block        = "10.0.254.0/24"
  availability_zone = "ap-south-1b"
  tags = {
    Name : "crictracker-Public-az-b",
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
  }
}

module "crictracker_public_subnet_az_c" {
  source            = "./terraform-modules/provider/aws/subnet/v1"
  vpc_id            = module.crictracker_vpc.vpc_id
  cidr_block        = "10.0.253.0/24"
  availability_zone = "ap-south-1c"
  tags = {
    Name : "crictracker-Public-az-c",
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
  }
}

# Create Private Subnets
module "crictracker_private_subnet_az_a" {
  source            = "./terraform-modules/provider/aws/subnet/v1"
  vpc_id            = module.crictracker_vpc.vpc_id
  cidr_block        = "10.0.0.0/18"
  availability_zone = "ap-south-1a"
  tags = {
    Name : "crictracker-Private-az-a",
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
  }
}

module "crictracker_private_subnet_az_b" {
  source            = "./terraform-modules/provider/aws/subnet/v1"
  vpc_id            = module.crictracker_vpc.vpc_id
  cidr_block        = "10.0.64.0/18"
  availability_zone = "ap-south-1b"
  tags = {
    Name : "crictracker-Private-az-b",
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
  }
}

module "crictracker_private_subnet_az_c" {
  source            = "./terraform-modules/provider/aws/subnet/v1"
  vpc_id            = module.crictracker_vpc.vpc_id
  cidr_block        = "10.0.128.0/18"
  availability_zone = "ap-south-1c"
  tags = {
    Name : "crictracker-Private-az-c",
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
  }
}

# Create NAT Gateway
module "crictracker_nat_gateway_az_a" {
  source        = "./terraform-modules/provider/aws/nat_gateway/v1"
  allocation_id = module.crictracker_eip_az_a.eip_id
  subnet_id     = module.crictracker_public_subnet_az_a.subnet_id
  tags = {
    Name : "crictracker-az-a",
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
  }
}

# module "crictracker_nat_gateway_az_b" {
#   source        = "./terraform-modules/provider/aws/nat_gateway/v1"
#   allocation_id = module.crictracker_eip_az_b.eip_id
#   subnet_id     = module.crictracker_public_subnet_az_b.subnet_id
#   tags = {
#     Name : "crictracker-az-b",
#     Author : "Terraform",
#     Contact : var.contact,
#     Environment : var.environment,
#   }
# }

# module "crictracker_nat_gateway_az_c" {
#   source        = "./terraform-modules/provider/aws/nat_gateway/v1"
#   allocation_id = module.crictracker_eip_az_c.eip_id
#   subnet_id     = module.crictracker_public_subnet_az_c.subnet_id
#   tags = {
#     Name : "crictracker-az-c",
#     Author : "Terraform",
#     Contact : var.contact,
#     Environment : var.environment,
#   }
# }


# Create Public route table
module "crictracker_route_table_public" {
  source = "./terraform-modules/provider/aws/route_table/v1"
  vpc_id = module.crictracker_vpc.vpc_id
  tags = {
    Name : "crictracker-Public",
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
  }
}


# Create 3 Private route table
module "crictracker_route_table_private_az_a" {
  source = "./terraform-modules/provider/aws/route_table/v1"
  vpc_id = module.crictracker_vpc.vpc_id
  tags = {
    Name : "crictracker-Private-az-a",
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
  }
}

module "crictracker_route_table_private_az_b" {
  source = "./terraform-modules/provider/aws/route_table/v1"
  vpc_id = module.crictracker_vpc.vpc_id
  tags = {
    Name : "crictracker-Private-az-b",
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
  }
}

module "crictracker_route_table_private_az_c" {
  source = "./terraform-modules/provider/aws/route_table/v1"
  vpc_id = module.crictracker_vpc.vpc_id
  tags = {
    Name : "crictracker-Private-az-c",
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
  }
}

# Create Public Route Table Associations with Public subnets
module "crictracker_route_table_association_public_subnet_az_a" {
  source         = "./terraform-modules/provider/aws/route_table_association/v1"
  route_table_id = module.crictracker_route_table_public.route_table_id
  subnet_id      = module.crictracker_public_subnet_az_a.subnet_id
}

module "crictracker_route_table_association_public_subnet_az_b" {
  source         = "./terraform-modules/provider/aws/route_table_association/v1"
  route_table_id = module.crictracker_route_table_public.route_table_id
  subnet_id      = module.crictracker_public_subnet_az_b.subnet_id
}

module "crictracker_route_table_association_public_subnet_az_c" {
  source         = "./terraform-modules/provider/aws/route_table_association/v1"
  route_table_id = module.crictracker_route_table_public.route_table_id
  subnet_id      = module.crictracker_public_subnet_az_c.subnet_id
}

# Create Private Route Table Associations with Private subnets 
module "crictracker_route_table_association_private_subnet_az_a" {
  source         = "./terraform-modules/provider/aws/route_table_association/v1"
  route_table_id = module.crictracker_route_table_private_az_a.route_table_id
  subnet_id      = module.crictracker_private_subnet_az_a.subnet_id
}

module "crictracker_route_table_association_private_subnet_az_b" {
  source         = "./terraform-modules/provider/aws/route_table_association/v1"
  route_table_id = module.crictracker_route_table_private_az_b.route_table_id
  subnet_id      = module.crictracker_private_subnet_az_b.subnet_id
}

module "crictracker_route_table_association_private_subnet_az_c" {
  source         = "./terraform-modules/provider/aws/route_table_association/v1"
  route_table_id = module.crictracker_route_table_private_az_c.route_table_id
  subnet_id      = module.crictracker_private_subnet_az_c.subnet_id
}

# Add routes to public route table
module "crictracker_internet_route_internet_gateway" {
  source                 = "./terraform-modules/provider/aws/route/v1"
  route_table_id         = module.crictracker_route_table_public.route_table_id
  destination_cidr_block = "0.0.0.0/0"
  is_gateway             = true
  gateway_id             = module.crictracker_internet_gateway.internet_gateway_id
}

# Add routes to private route tables
module "crictracker_internet_route_nat_gateway_az_a" {
  source                 = "./terraform-modules/provider/aws/route/v1"
  route_table_id         = module.crictracker_route_table_private_az_a.route_table_id
  destination_cidr_block = "0.0.0.0/0"
  is_nat_gateway         = true
  # is_gateway             = true
  nat_gateway_id         = module.crictracker_nat_gateway_az_a.nat_gateway_id
  # gateway_id             = module.crictracker_internet_gateway.internet_gateway_id
}

module "crictracker_internet_route_nat_gateway_az_b" {
  source                 = "./terraform-modules/provider/aws/route/v1"
  route_table_id         = module.crictracker_route_table_private_az_b.route_table_id
  destination_cidr_block = "0.0.0.0/0"
  is_nat_gateway         = true
  # is_gateway             = true
  nat_gateway_id         = module.crictracker_nat_gateway_az_a.nat_gateway_id
  # gateway_id             = module.crictracker_internet_gateway.internet_gateway_id
}

module "crictracker_internet_route_nat_gateway_az_c" {
  source                 = "./terraform-modules/provider/aws/route/v1"
  route_table_id         = module.crictracker_route_table_private_az_c.route_table_id
  destination_cidr_block = "0.0.0.0/0"
  is_nat_gateway         = true
  # is_gateway             = true
  nat_gateway_id         = module.crictracker_nat_gateway_az_a.nat_gateway_id
  # gateway_id             = module.crictracker_internet_gateway.internet_gateway_id
}

module "crictracker_route53_public_main" {
  source  = "./terraform-modules/provider/aws/route53_zone"
  name    = var.public_domain
  comment = "crictracker public zone"
  tags = {
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
  }
}

module "crictracker_rout53_private" {
  source       = "./terraform-modules/provider/aws/route53_zone"
  name         = "${var.public_domain}.private"
  comment      = "crictracker Private zone"
  private_zone = true
  vpc_id       = module.crictracker_vpc.vpc_id
  tags = {
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
  }
}

module "crictracker_route53_public" {
  source  = "./terraform-modules/provider/aws/route53_zone"
  name    = var.sub_domain
  comment = "sportgully public zone"
  tags = {
    Author : "Terraform",
    Contact : var.contact,
    Environment : var.environment,
  }
}