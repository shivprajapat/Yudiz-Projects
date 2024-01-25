# module "crictracker_wafv2_ip_set-block-ip-backend" {
#   source = "./terraform-modules/provider/aws/wafv2_ip_set/v1"

#   name = "block-ip-backend"
#   description = "Block Backend"
#   addresses = []

# }

# module "crictracker_wafv2_ip_set-whitelist-for-ratelimit" {
#   source = "./terraform-modules/provider/aws/wafv2_ip_set/v1"

#   name = "whitelist-for-ratelimit"
#   description = "Block Backend"
#   addresses = []  # in list form comma seperated
  
# }
