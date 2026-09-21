resource "aws_lb" "api" {
  name                       = var.name
  internal                   = false
  load_balancer_type         = "application"
  subnets                    = aws_subnet.public[*].id
  security_groups            = [aws_security_group.alb.id]
  enable_deletion_protection = true
  drop_invalid_header_fields = true
  desync_mitigation_mode     = "strictest"
  depends_on                 = [aws_route_table_association.public]
  lifecycle { prevent_destroy = true }
}
resource "aws_lb_target_group" "api" {
  name                 = "${var.name}-api"
  vpc_id               = aws_vpc.clinic.id
  target_type          = "ip"
  protocol             = "HTTP"
  port                 = 4000
  deregistration_delay = 30
  health_check {
    path    = "/health/ready"
    matcher = "200"
  }
}
resource "aws_lb_listener" "api" {
  load_balancer_arn = aws_lb.api.arn
  protocol          = "HTTPS"
  port              = 443
  certificate_arn   = var.domains.origin_certificate_arn
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  default_action {
    type = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      status_code  = "403"
      message_body = "Staging origin access denied"
    }
  }
}
resource "aws_lb_listener_rule" "origin" {
  listener_arn = aws_lb_listener.api.arn
  priority     = 1
  condition {
    http_header {
      http_header_name = "x-mcclinic-origin"
      values           = [var.origin_header_secret]
    }
  }
  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }
}
resource "aws_route53_record" "origin" {
  zone_id = var.domains.zone_id
  name    = var.domains.origin
  type    = "A"
  alias {
    name                   = aws_lb.api.dns_name
    zone_id                = aws_lb.api.zone_id
    evaluate_target_health = false
  }
}
resource "aws_wafv2_ip_set" "testers" {
  provider           = aws.edge
  name               = "${var.name}-testers"
  scope              = "CLOUDFRONT"
  ip_address_version = "IPV4"
  addresses          = var.tester_cidrs
}
resource "aws_wafv2_web_acl" "testers" {
  provider = aws.edge
  name     = "${var.name}-testers"
  scope    = "CLOUDFRONT"
  default_action {
    block {}
  }
  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${var.name}-edge"
    sampled_requests_enabled   = false
  }
  rule {
    name     = "RateLimit"
    priority = 0
    action {
      block {}
    }
    statement {
      rate_based_statement {
        limit              = 2000
        aggregate_key_type = "IP"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.name}-rate"
      sampled_requests_enabled   = false
    }
  }
  rule {
    name     = "ApprovedTesters"
    priority = 1
    action {
      allow {}
    }
    statement {
      ip_set_reference_statement { arn = aws_wafv2_ip_set.testers.arn }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.name}-testers"
      sampled_requests_enabled   = false
    }
  }
}
resource "aws_cloudfront_cache_policy" "none" {
  name        = "${var.name}-no-cache"
  min_ttl     = 0
  default_ttl = 0
  max_ttl     = 0
  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_gzip = false
    cookies_config { cookie_behavior = "none" }
    headers_config { header_behavior = "none" }
    query_strings_config { query_string_behavior = "none" }
  }
}
resource "aws_cloudfront_origin_request_policy" "api" {
  name = "${var.name}-api"
  cookies_config { cookie_behavior = "all" }
  headers_config {
    header_behavior = "allExcept"
    headers { items = ["host"] }
  }
  query_strings_config { query_string_behavior = "all" }
}
resource "aws_cloudfront_response_headers_policy" "clinical" {
  name = "${var.name}-clinical"
  custom_headers_config {
    items {
      header   = "Cache-Control"
      value    = "no-store"
      override = true
    }
  }
  security_headers_config {
    content_type_options { override = true }
    referrer_policy {
      referrer_policy = "no-referrer"
      override        = true
    }
    frame_options {
      frame_option = "SAMEORIGIN"
      override     = true
    }
    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = false
      preload                    = false
      override                   = true
    }
    content_security_policy {
      content_security_policy = "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; frame-src 'self' blob:; font-src 'self'; connect-src 'self'; frame-ancestors 'self'; base-uri 'none'; form-action 'self'"
      override                = true
    }
  }
}
resource "aws_cloudfront_function" "shell" {
  name    = "${var.name}-shell"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = <<-JS
    function handler(event) {
      var request = event.request;
      if (request.uri === '/' || request.uri === '/clinic' || request.uri === '/clinic/') request.uri = '/index.html';
      return request;
    }
  JS
}
resource "aws_cloudfront_origin_access_control" "assets" {
  name                              = "${var.name}-assets"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}
resource "aws_cloudfront_distribution" "web" {
  enabled          = true
  aliases          = [var.domains.web]
  web_acl_id       = aws_wafv2_web_acl.testers.arn
  http_version     = "http2and3"
  is_ipv6_enabled  = false
  retain_on_delete = true
  origin {
    origin_id                = "assets"
    domain_name              = aws_s3_bucket.web.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.assets.id
    s3_origin_config { origin_access_identity = "" }
  }
  origin {
    origin_id   = "api"
    domain_name = var.domains.origin
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
      origin_read_timeout    = 30
    }
    custom_header {
      name  = "x-mcclinic-origin"
      value = var.origin_header_secret
    }
  }
  default_cache_behavior {
    target_origin_id           = "assets"
    viewer_protocol_policy     = "https-only"
    allowed_methods            = ["GET", "HEAD"]
    cached_methods             = ["GET", "HEAD"]
    cache_policy_id            = aws_cloudfront_cache_policy.none.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.clinical.id
    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.shell.arn
    }
  }
  dynamic "ordered_cache_behavior" {
    for_each = ["/mvp/*", "/graphql"]
    content {
      path_pattern               = ordered_cache_behavior.value
      target_origin_id           = "api"
      viewer_protocol_policy     = "https-only"
      allowed_methods            = ["GET", "HEAD", "OPTIONS", "PUT", "PATCH", "POST", "DELETE"]
      cached_methods             = ["GET", "HEAD"]
      cache_policy_id            = aws_cloudfront_cache_policy.none.id
      origin_request_policy_id   = aws_cloudfront_origin_request_policy.api.id
      response_headers_policy_id = aws_cloudfront_response_headers_policy.clinical.id
    }
  }
  dynamic "custom_error_response" {
    for_each = [403, 404, 500, 502, 503, 504]
    content {
      error_code            = custom_error_response.value
      error_caching_min_ttl = 0
    }
  }
  restrictions {
    geo_restriction { restriction_type = "none" }
  }
  viewer_certificate {
    acm_certificate_arn      = var.domains.edge_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
  lifecycle { prevent_destroy = true }
}
resource "aws_route53_record" "web" {
  zone_id = var.domains.zone_id
  name    = var.domains.web
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.web.domain_name
    zone_id                = aws_cloudfront_distribution.web.hosted_zone_id
    evaluate_target_health = false
  }
}
