data "aws_vpc" "default" {
    default = true
}
resource "aws_security_group" "yw_app" {
    name = "yw_app"
    description = "Security group for yachay-wasi_app"
    vpc_id = data.aws_vpc.default.id
}

ingress {
    description = "SSH"
    from_port = 22
    to_port= 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
}

ingress {
    description = "HTTP"
    from_port = 80
    to_port= 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
}

ingress {
    description = "HTTPS"
    from_port = 443
    to_port= 443
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
}
ingress {
    description = "NestJS"
    from_port = 3000
    to_port= 3000
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
}

egress {
    from_port = 0
    to_port= 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
}

resource "aws_iam_role" "ec2_ssm_role" {
    name = "ec2_ssm_role"
    assume_role_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Action = "sts:AssumeRole"
                Effect = "Allow"
                Principal = {
                    Service = "ec2.amazonaws.com"
                }
            }
        ]
    })
}
resource "aws_iam_role_policy" "ssm_access_policy" {
  name = "ssm-access-policy"
  role = aws_iam_role.ec2_ssm_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Action = [
        "ssm:GetParameter"
      ],
      Resource = "*"
    }]
  })
}
resource "aws_iam_instance_profile" "ec2_ssm_instance_profile" {
    name = "ec2_ssm_instance_profile"
    roles = [aws_iam_role.ec2_ssm_role.name]
}

resource "aws_instance" "yw_app" {
    ami = "ami-06971c49acd687c30"
    instance_type = "t2.micro"
    key_name = "yw_app_key"
    vpc_security_group_ids = [aws_security_group.yw_app.id]
    iam_instance_profile = aws_iam_instance_profile.ec2_ssm_instance_profile.name
}
root_block_device {
    volume_size = 7
    volume_type = "gp3"
}
vpc_security_group_ids = [aws_security_group.yw_app.id]

tags = {
    Name = "yw_app"
}

user_data = <<EOF
    #!/bin/bash
    exec > /var/log/user-data.log 2>&1
    set -e
    timedatectl set-timezone America/Lima

    yum update -y
    yum install -y git docker
    systemctl start docker
    systemctl enable docker
    usermod -aG docker ec2-user

    mkdir -p /usr/local/libexec/docker/cli-plugins
    curl -L "https://github.com/docker/compose/releases/download/v2.27.0/docker-compose-linux-x86_64" \
      -o /usr/local/libexec/docker/cli-plugins/docker-compose
    chmod +x /usr/local/libexec/docker/cli-plugins/docker-composeç
    su - ec2-user -c "
      git clone https://github.com/Anthonymss/yachay-wasi_back.git &&
      cd yachay-wasi_back &&
      aws ssm get-parameter --name /yachay-wasi/env --with-decryption --region us-east-2 --output text --query 'Parameter.Value' > .env &&
      docker compose --env-file .env up -d
    "
    EOF