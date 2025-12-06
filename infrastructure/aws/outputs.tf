output "alb_dns_name" {
  description = "DNS do Application Load Balancer"
  value       = module.alb.alb_dns_name
}

output "frontend_url" {
  description = "URL do Frontend"
  value       = "http://${module.alb.alb_dns_name}"
}

output "api_url" {
  description = "URL da API"
  value       = "http://${module.alb.alb_dns_name}/api"
}

output "ecr_repositories" {
  description = "URLs dos repositórios ECR"
  value       = module.ecr.repository_urls
}

output "ecs_cluster_name" {
  description = "Nome do cluster ECS"
  value       = module.ecs.cluster_name
}

output "vpc_id" {
  description = "ID da VPC"
  value       = module.vpc.vpc_id
}

# Comandos úteis
output "docker_login_command" {
  description = "Comando para login no ECR"
  value       = "aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin ${module.ecr.registry_url}"
}

output "deploy_commands" {
  description = "Comandos para deploy"
  value = {
    api = "cd coomb-api && docker build -t ${module.ecr.repository_urls["coomb-api"]}:latest . && docker push ${module.ecr.repository_urls["coomb-api"]}:latest"
    pdf = "cd coomb-pdf && docker build -t ${module.ecr.repository_urls["coomb-pdf"]}:latest . && docker push ${module.ecr.repository_urls["coomb-pdf"]}:latest"
    web = "cd coomb-web && docker build -t ${module.ecr.repository_urls["coomb-web"]}:latest . && docker push ${module.ecr.repository_urls["coomb-web"]}:latest"
  }
}
