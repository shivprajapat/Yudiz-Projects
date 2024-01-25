module "crictracker_admin_panel_policy" {
  source = "./terraform-modules/provider/aws/s3_bucket_policy/v1"

  depends_on = [
    module.crictracker_admin_panel,
  ]
  bucket = module.crictracker_admin_panel.s3_bucket_bucket
  policy = jsonencode({
    "Version": "2012-10-17",    
    "Statement": [        
      {            
          "Sid": "PublicReadGetObject",            
          "Effect": "Allow",            
          "Principal": "*",            
          "Action": [                
            #  "s3:GetObject",
            #  "s3:PutObject",
            #  "s3:DeleteObject",
            "*",          
          ],            
          "Resource" : [
              "${module.crictracker_admin_panel.s3_bucket_arn}",
              "${module.crictracker_admin_panel.s3_bucket_arn}/*",
        ]    
      }    
    ]
  })
}

module "crictracker_admin_panel_local_dev_policy" {
  source = "./terraform-modules/provider/aws/s3_bucket_policy/v1"

  depends_on = [
    module.crictracker_admin_panel_local_dev,
  ]
  bucket = module.crictracker_admin_panel_local_dev.s3_bucket_bucket
  policy = jsonencode({
    "Version": "2012-10-17",    
    "Statement": [        
      {            
          "Sid": "PublicReadGetObject",            
          "Effect": "Allow",            
          "Principal": "*",            
          "Action": [                
            #  "s3:GetObject",
            #  "s3:PutObject",
            #  "s3:DeleteObject",
            "*",          
          ],            
          "Resource" : [
              "${module.crictracker_admin_panel_local_dev.s3_bucket_arn}",
              "${module.crictracker_admin_panel_local_dev.s3_bucket_arn}/*",
        ]    
      }    
    ]
  })
}