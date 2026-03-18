# Automatically fetch the latest Ubuntu 24.04 LTS AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical's official AWS account ID

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Upload your local SSH public key to AWS
resource "aws_key_pair" "gitops_key" {
  key_name   = "gitops-aws-key"
  public_key = file("~/.ssh/gitops_aws_key.pub")
}

# ----------------------------------------------------
# 1. THE MASTER NODE (Control Plane + Jenkins + ArgoCD)
# ----------------------------------------------------
resource "aws_instance" "master" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "m7i-flex.large"
  key_name      = aws_key_pair.gitops_key.key_name
  subnet_id     = module.vpc.public_subnets[0]
  
  vpc_security_group_ids = [aws_security_group.gitops_sg.id]

  root_block_device {
    volume_size = 10 
    volume_type = "gp3"
  }

  tags = {
    Name = "GitOps-Master"
    Role = "ControlPlane"
  }
}

# ----------------------------------------------------
# 2. WORKER NODE 1 (Runs Spring Boot & Next.js Pods)
# ----------------------------------------------------
resource "aws_instance" "worker_1" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "c7i-flex.large"
  key_name      = aws_key_pair.gitops_key.key_name
  subnet_id     = module.vpc.public_subnets[0]
  
  vpc_security_group_ids = [aws_security_group.gitops_sg.id]

  root_block_device {
    volume_size = 8 
    volume_type = "gp3"
  }

  tags = {
    Name = "GitOps-Worker-1"
    Role = "Worker"
  }
}

# ----------------------------------------------------
# 3. WORKER NODE 2 (Runs Spring Boot & Next.js Pods)
# ----------------------------------------------------
resource "aws_instance" "worker_2" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "c7i-flex.large"
  key_name      = aws_key_pair.gitops_key.key_name
  subnet_id     = module.vpc.public_subnets[0]
  
  vpc_security_group_ids = [aws_security_group.gitops_sg.id]

  root_block_device {
    volume_size = 8 
    volume_type = "gp3"
  }

  tags = {
    Name = "GitOps-Worker-2"
    Role = "Worker"
  }
}

# ----------------------------------------------------
# OUTPUTS (Prints IPs to the terminal)
# ----------------------------------------------------
output "master_public_ip" {
  value       = aws_instance.master.public_ip
  description = "The public IP of the Master Node"
}

output "worker_1_public_ip" {
  value       = aws_instance.worker_1.public_ip
  description = "The public IP of Worker Node 1"
}

output "worker_2_public_ip" {
  value       = aws_instance.worker_2.public_ip
  description = "The public IP of Worker Node 2"
}