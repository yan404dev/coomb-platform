variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Nome do projeto"
  type        = string
  default     = "coomb"
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "domain_name" {
  description = "Domínio customizado (opcional)"
  type        = string
  default     = ""
}

# Custos estimados
variable "api_cpu" {
  description = "CPU para API (256, 512, 1024, 2048, 4096)"
  type        = number
  default     = 512
}

variable "api_memory" {
  description = "Memória para API em MB (512, 1024, 2048, etc)"
  type        = number
  default     = 1024
}

variable "pdf_cpu" {
  description = "CPU para PDF Service"
  type        = number
  default     = 256
}

variable "pdf_memory" {
  description = "Memória para PDF Service em MB"
  type        = number
  default     = 512
}

variable "web_cpu" {
  description = "CPU para Frontend"
  type        = number
  default     = 512
}

variable "web_memory" {
  description = "Memória para Frontend em MB"
  type        = number
  default     = 1024
}

variable "desired_count" {
  description = "Número de tasks por serviço"
  type        = number
  default     = 1
}
