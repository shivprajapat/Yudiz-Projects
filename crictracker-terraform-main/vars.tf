variable "aws_account_number" {
  type = number
}

variable "terraform_user" {
  type = string
}

variable "aws_region" {
  type = string
}


#Tags Variables
variable "last_updated" {
  type = string
}

variable "contact" {
  type = string
  description = "Name of contact persons"
}

variable "environment" {
  type = string
  default = "dev"  
}

variable "public_domain" {
  type = string
}


variable "rds_deletion_protection" {
  type = bool
  default = true
}

variable "sub_domain" {
  type = string
}