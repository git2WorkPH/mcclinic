resource "aws_vpc" "clinic" {
  cidr_block           = "10.80.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
}
resource "aws_subnet" "private" {
  count                   = 2
  vpc_id                  = aws_vpc.clinic.id
  cidr_block              = "10.80.${10 + count.index}.0/24"
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = false
}
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.clinic.id
  route  = []
}
resource "aws_route_table_association" "private" {
  count          = 2
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}
resource "aws_security_group" "runtime" {
  name_prefix = "${var.name}-runtime-"
  description = "Private runtime; ALB ingress only"
  vpc_id      = aws_vpc.clinic.id
  egress {
    protocol    = "tcp"
    from_port   = 443
    to_port     = 443
    cidr_blocks = [aws_vpc.clinic.cidr_block]
  }
  egress {
    protocol        = "tcp"
    from_port       = 443
    to_port         = 443
    prefix_list_ids = [var.s3_prefix_list_id]
  }
  egress {
    protocol    = "tcp"
    from_port   = 5432
    to_port     = 5432
    cidr_blocks = [aws_vpc.clinic.cidr_block]
  }
  egress {
    protocol    = "tcp"
    from_port   = 2049
    to_port     = 2049
    cidr_blocks = [aws_vpc.clinic.cidr_block]
  }
  ingress {
    protocol        = "tcp"
    from_port       = 4000
    to_port         = 4000
    security_groups = [aws_security_group.alb.id]
  }
}
resource "aws_security_group" "database" {
  name_prefix = "${var.name}-db-"
  vpc_id      = aws_vpc.clinic.id
  ingress {
    protocol        = "tcp"
    from_port       = 5432
    to_port         = 5432
    security_groups = [aws_security_group.runtime.id]
  }
  egress = []
}
resource "aws_security_group" "endpoint" {
  name_prefix = "${var.name}-endpoints-"
  vpc_id      = aws_vpc.clinic.id
  ingress {
    protocol        = "tcp"
    from_port       = 443
    to_port         = 443
    security_groups = [aws_security_group.runtime.id]
  }
  egress = []
}
resource "aws_vpc_endpoint" "services" {
  for_each            = toset(["ecr.api", "ecr.dkr", "logs", "secretsmanager", "kms"])
  vpc_id              = aws_vpc.clinic.id
  service_name        = "com.amazonaws.ap-southeast-1.${each.key}"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true
  subnet_ids          = aws_subnet.private[*].id
  security_group_ids  = [aws_security_group.endpoint.id]
}
resource "aws_vpc_endpoint" "s3" {
  vpc_id            = aws_vpc.clinic.id
  service_name      = "com.amazonaws.ap-southeast-1.s3"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = [aws_route_table.private.id]
}
resource "aws_internet_gateway" "alb" { vpc_id = aws_vpc.clinic.id }
resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.clinic.id
  cidr_block              = "10.80.${20 + count.index}.0/24"
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = false
}
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.clinic.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.alb.id
  }
}
resource "aws_route_table_association" "public" {
  count          = 2
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}
resource "aws_security_group" "alb" {
  name_prefix = "${var.name}-alb-"
  vpc_id      = aws_vpc.clinic.id
  ingress {
    protocol        = "tcp"
    from_port       = 443
    to_port         = 443
    prefix_list_ids = [var.cloudfront_prefix_list_id]
  }
  egress {
    protocol    = "tcp"
    from_port   = 4000
    to_port     = 4000
    cidr_blocks = [aws_vpc.clinic.cidr_block]
  }
}
