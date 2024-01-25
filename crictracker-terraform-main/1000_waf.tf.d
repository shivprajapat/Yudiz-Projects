# module "crictracker_waf" {
#   source      = "./terraform-modules/provider/aws/wafv2_web_acl/v1"
#   name        = "crictracker"
#   description = "Web App Firewall for crictracker"
#   scope       = "REGIONAL"

#   # Cloudwatch Visibility Parameters
#   metric_name = "crictracker-cloudwatch-waf"
# }


module "crictracker_kinesis_firehose_delivery_stream_waf" {
  source = "./terraform-modules/provider/aws/kinesis_firehose_delivery_stream/v1"

  depends_on = [
    module.crictracker_s3_bucket_waf_firehose_log,
    module.iam_role_for_crictracker_kinesis_firehose_delivery_stream_waf
  ]

  name        = "crictracker-firehose-waf"
  destination = "extended_s3"

  role_arn   = module.iam_role_for_crictracker_kinesis_firehose_delivery_stream_waf.iam_role_arn
  bucket_arn = module.crictracker_s3_bucket_waf_firehose_log.s3_bucket_arn
}


module "iam_role_for_crictracker_kinesis_firehose_delivery_stream_waf" {
  source = "./terraform-modules/provider/aws/iam_role/v1"
  name   = "kinesis_firehose_delivery_stream"
  assume_role_policy = jsonencode(
    {
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Action" : "sts:AssumeRole",
          "Principal" : {
            "Service" : "firehose.amazonaws.com"
          },
          "Effect" : "Allow",
          "Sid" : ""
        }
      ]
    }
  )
}


module "crictracker_s3_bucket_waf_firehose_log" {
  source = "./terraform-modules/provider/aws/s3_bucket/v1"
  bucket = "crictracker-firehose-log"
}

module "crictracker_waf_logging_attachment" {
  depends_on = [
    module.crictracker_kinesis_firehose_delivery_stream_waf
  ]
  source                  = "./terraform-modules/provider/aws/wafv2_web_acl_logging_configuration/v1"
  log_destination_configs = ["${module.crictracker_kinesis_firehose_delivery_stream_waf.kinesis_firehose_delivery_stream_arn}"]
  resource_arn            = module.crictracker_waf.wafv2_web_acl_arn
}

# module "crictracker_waf_association_load_balancer" {
#   source = "./terraform-modules/provider/aws/wafv2_web_acl_association/v1"
#   # resource_arn = "${module.ef}"
#   web_acl_arn = "${module.crictracker_waf.wafv2_web_acl_arn}"
# }