module "crictracker_iam_user_policy_attachment_kyc-restriction_kyc-user" {
  source = "./terraform-modules/provider/aws/iam_user_policy_attachment/v1"

  depends_on = [
    module.crictracker_iam_access_key_user_kyc,
    module.crictracker_iam_user_policy_kyc
  ]
  user = "${module.crictracker_iam_access_key_user_kyc.iam_user_name}"
  policy_arn = "${module.crictracker_iam_user_policy_kyc.iam_policy_arn}"

}