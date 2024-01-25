module "crictracker_admin_panel" {
  source = "./terraform-modules/provider/aws/s3_bucket/v1"
  bucket = "crictracker-admin-panel-08032022"

  cors_rule = true
  allowed_headers = ["*"]
  allowed_methods = ["PUT", "POST", "GET"]
  allowed_origins = ["*"]

}

module "crictracker_alb_logs_bucket" {
  source = "./terraform-modules/provider/aws/s3_bucket/v1"
  bucket = "crictracker-alb-logs-08032022"
}

module "crictracker_kyc_cdn_logs_bucket" {
  source = "./terraform-modules/provider/aws/s3_bucket/v1"
  bucket = "crictracker-cdn-logs-08032022"
}

module "crictracker_mongoDBdumps_bucket" {
  source = "./terraform-modules/provider/aws/s3_bucket/v1"
  bucket = "crictracker-mongodbdumps-08032022"
}

module "crictracker_admin_panel_local_dev" {
  source = "./terraform-modules/provider/aws/s3_bucket/v1"
  bucket = "crictracker-admin-panel-local-dev-08032022"

  cors_rule = true
  allowed_headers = ["*"]
  allowed_methods = ["PUT", "POST", "GET"]
  allowed_origins = ["*"]

}
