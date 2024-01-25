module "crictracker_iam_access_key_user_kyc" {
    source = "./terraform-modules/provider/aws/iam_access_key/v1"
    new_user = true
    user = "kyc_user"
}