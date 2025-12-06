terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Backend para state - descomente após criar bucket S3
  # backend "s3" {
  #   bucket = "coomb-terraform-state"
  #   key    = "prod/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

provider "aws" {
  region = var.aws_region
}

# VPC e Networking
module "vpc" {
  source = "./modules/vpc"

  project_name = var.project_name
  environment  = var.environment
}

# ECR Repositories (Docker Registry)
module "ecr" {
  source = "./modules/ecr"

  project_name = var.project_name
  repositories = ["coomb-api", "coomb-pdf", "coomb-web"]
}

# Application Load Balancer
module "alb" {
  source = "./modules/alb"

  project_name = var.project_name
  environment  = var.environment
  vpc_id       = module.vpc.vpc_id
  public_subnets = module.vpc.public_subnets
}

# ECS Cluster
module "ecs" {
  source = "./modules/ecs"

  project_name   = var.project_name
  environment    = var.environment
  vpc_id         = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets
  alb_target_groups = module.alb.target_groups

  # Imagens Docker (atualize após push para ECR)
  api_image  = "${module.ecr.repository_urls["coomb-api"]}:latest"
  pdf_image  = "${module.ecr.repository_urls["coomb-pdf"]}:latest"
  web_image  = "${module.ecr.repository_urls["coomb-web"]}:latest"

  # Variáveis de ambiente (use AWS Secrets Manager em produção)
  api_environment = [
    { name = "NODE_ENV", value = "production" },
    { name = "PORT", value = "3001" }
  ]

  api_secrets = [
    { name = "DATABASE_URL", valueFrom = aws_secretsmanager_secret.database_url.arn },
    { name = "JWT_SECRET", valueFrom = aws_secretsmanager_secret.jwt_secret.arn },
    { name = "OPENAI_API_KEY", valueFrom = aws_secretsmanager_secret.openai_key.arn }
  ]
}

# Secrets Manager
resource "aws_secretsmanager_secret" "database_url" {
  name = "${var.project_name}-database-url"
}

resource "aws_secretsmanager_secret" "jwt_secret" {
  name = "${var.project_name}-jwt-secret"
}

resource "aws_secretsmanager_secret" "openai_key" {
  name = "${var.project_name}-openai-key"
}
