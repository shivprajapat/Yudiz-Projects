#LOCAL-DEV Repos
 
module "crictracker-admin-frontend-local-dev" {
   source = "./terraform-modules/provider/aws/ecr_repository/v1"
   name = "crictracker-admin-frontend-local-dev"
   image_tag_mutability = "MUTABLE"
   scan_on_push =true
}
 
module "crictracker-article-local-dev" {
   source = "./terraform-modules/provider/aws/ecr_repository/v1"
   name = "crictracker-article-local-dev"
   image_tag_mutability = "MUTABLE"
   scan_on_push =true
}
 
module "crictracker-authentication-local-dev" {
   source = "./terraform-modules/provider/aws/ecr_repository/v1"
   name = "crictracker-authentication-local-dev"
   image_tag_mutability = "MUTABLE"
   scan_on_push =true
}
 
module "crictracker-career-local-dev" {
   source = "./terraform-modules/provider/aws/ecr_repository/v1"
   name = "crictracker-career-local-dev"
   image_tag_mutability = "MUTABLE"
   scan_on_push =true
}
 
module "crictracker-gateway-local-dev" {
   source = "./terraform-modules/provider/aws/ecr_repository/v1"
   name = "crictracker-gateway-local-dev"
   image_tag_mutability = "MUTABLE"
   scan_on_push =true
}
 
module "crictracker-global-widget-local-dev" {
   source = "./terraform-modules/provider/aws/ecr_repository/v1"
   name = "crictracker-global-widget-local-dev"
   image_tag_mutability = "MUTABLE"
   scan_on_push =true
}
 
module "crictracker-help-local-dev" {
   source = "./terraform-modules/provider/aws/ecr_repository/v1"
   name = "crictracker-help-local-dev"
   image_tag_mutability = "MUTABLE"
   scan_on_push =true
}
 
module "crictracker-matchmanagement-local-dev" {
   source = "./terraform-modules/provider/aws/ecr_repository/v1"
   name = "crictracker-matchmanagement-local-dev"
   image_tag_mutability = "MUTABLE"
   scan_on_push =true
}
 
module "crictracker-migrations-local-dev" {
   source = "./terraform-modules/provider/aws/ecr_repository/v1"
   name = "crictracker-migrations-local-dev"
   image_tag_mutability = "MUTABLE"
   scan_on_push =true
}
 
module "crictracker-redis-server-local-dev" {
   source = "./terraform-modules/provider/aws/ecr_repository/v1"
   name = "crictracker-redis-server-local-dev"
   image_tag_mutability = "MUTABLE"
   scan_on_push =true
}
 
module "crictracker-seo-local-dev" {
   source = "./terraform-modules/provider/aws/ecr_repository/v1"
   name = "crictracker-seo-local-dev"
   image_tag_mutability = "MUTABLE"
   scan_on_push =true
}
 
module "crictracker-subscription-local-dev" {
   source = "./terraform-modules/provider/aws/ecr_repository/v1"
   name = "crictracker-subscription-local-dev"
   image_tag_mutability = "MUTABLE"
   scan_on_push =true
}
 
module "crictracker-website-local-dev" {
   source = "./terraform-modules/provider/aws/ecr_repository/v1"
   name = "crictracker-website-local-dev"
   image_tag_mutability = "MUTABLE"
   scan_on_push =true
}
 
module "crictracker-mongodbdumps-local-dev" {
   source = "./terraform-modules/provider/aws/ecr_repository/v1"
   name = "crictracker-mongodbdumps-local-dev"
   image_tag_mutability = "MUTABLE"
   scan_on_push =true
}


# DEV Repos

module "crictracker-admin-frontend-dev" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-admin-frontend-dev"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-article-dev" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-article-dev"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-authentication-dev" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-authentication-dev"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-career-dev" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-career-dev"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-gateway-dev" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-gateway-dev"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-global-widget-dev" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-global-widget-dev"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-help-dev" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-help-dev"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-matchmanagement-dev" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-matchmanagement-dev"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-migrations-dev" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-migrations-dev"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-redis-server-dev" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-redis-server-dev"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-seo-dev" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-seo-dev"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-subscription-dev" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-subscription-dev"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-website-dev" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-website-dev"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-mongodbdumps-dev" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-mongodbdumps-dev"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

# STAG Repos 

module "crictracker-admin-frontend-stag" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-admin-frontend-stag"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-article-stag" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-article-stag"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-authentication-stag" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-authentication-stag"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-career-stag" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-career-stag"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-gateway-stag" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-gateway-stag"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-global-widget-stag" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-global-widget-stag"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-help-stag" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-help-stag"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-matchmanagement-stag" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-matchmanagement-stag"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-migrations-stag" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-migrations-stag"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-redis-server-stag" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-redis-server-stag"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-seo-stag" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-seo-stag"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-subscription-stag" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-subscription-stag"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-website-stag" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-website-stag"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

# PROD Repos

module "crictracker-admin-frontend" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-admin-frontend"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-article" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-article"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-authentication" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-authentication"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-career" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-career"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-gateway" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-gateway"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-global-widget" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-global-widget"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-help" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-help"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-matchmanagement" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-matchmanagement"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-migrations" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-migrations"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-redis-server" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-redis-server"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-seo" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-seo"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-subscription" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-subscription"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-website" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-website"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-mongodbdumps" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-mongodbdumps"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-crons-local-dev" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-crons-local-dev"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-crons-dev" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-crons-dev"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}

module "crictracker-crons" {
    source = "./terraform-modules/provider/aws/ecr_repository/v1"
    name = "crictracker-crons"
    image_tag_mutability = "MUTABLE"
    scan_on_push =true
}