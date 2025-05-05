#!/bin/bash

# AWS EC2 Features Review Script
# This script provides a comprehensive overview of all functional features in AWS EC2

# Set text colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
  echo -e "\n${BLUE}=================================================${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}=================================================${NC}\n"
}

# Function to print subsection headers
print_subheader() {
  echo -e "\n${CYAN}$1${NC}"
  echo -e "${CYAN}-------------------------------------------------${NC}"
}

# Function to check if AWS CLI is installed
check_aws_cli() {
  if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed.${NC}"
    echo "Please install it using: pip install awscli"
    exit 1
  fi
}

# Function to check if AWS credentials are configured
check_aws_credentials() {
  if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Error: AWS credentials are not configured or are invalid.${NC}"
    echo "Please configure your AWS credentials using: aws configure"
    exit 1
  fi
}

# Function to get account information
get_account_info() {
  print_header "AWS Account Information"
  
  echo -e "${GREEN}Account ID:${NC} $(aws sts get-caller-identity --query 'Account' --output text)"
  echo -e "${GREEN}User ARN:${NC} $(aws sts get-caller-identity --query 'Arn' --output text)"
  echo -e "${GREEN}Current Region:${NC} $(aws configure get region)"
}

# Function to get EC2 instance information
get_ec2_instances() {
  print_header "EC2 Instances"
  
  local instances=$(aws ec2 describe-instances --query 'Reservations[*].Instances[*].[InstanceId,State.Name,InstanceType,LaunchTime,Platform,Tags[?Key==`Name`].Value|[0]]' --output text)
  
  if [ -z "$instances" ]; then
    echo -e "${YELLOW}No EC2 instances found.${NC}"
    return
  fi
  
  echo -e "${GREEN}Instance ID${NC}\t${GREEN}State${NC}\t\t${GREEN}Type${NC}\t\t${GREEN}Launch Time${NC}\t\t${GREEN}Platform${NC}\t${GREEN}Name${NC}"
  echo -e "--------------------------------------------------------------------------------------------------------"
  
  echo "$instances" | while read -r line; do
    IFS=$'\t' read -r id state type launch_time platform name <<< "$line"
    echo -e "$id\t$state\t$type\t$launch_time\t$platform\t$name"
  done
}

# Function to get EC2 instance types
get_instance_types() {
  print_header "EC2 Instance Types"
  
  print_subheader "General Purpose"
  aws ec2 describe-instance-types --filters "Name=instance-type,Values=t2.*,t3.*,t4.*,m5.*,m6.*" --query 'InstanceTypes[*].[InstanceType,VCpuInfo.DefaultVCpus,MemoryInfo.SizeInMiB,NetworkInfo.NetworkPerformance]' --output table
  
  print_subheader "Compute Optimized"
  aws ec2 describe-instance-types --filters "Name=instance-type,Values=c5.*,c6.*" --query 'InstanceTypes[*].[InstanceType,VCpuInfo.DefaultVCpus,MemoryInfo.SizeInMiB,NetworkInfo.NetworkPerformance]' --output table
  
  print_subheader "Memory Optimized"
  aws ec2 describe-instance-types --filters "Name=instance-type,Values=r5.*,r6.*,x1.*,x2.*" --query 'InstanceTypes[*].[InstanceType,VCpuInfo.DefaultVCpus,MemoryInfo.SizeInMiB,NetworkInfo.NetworkPerformance]' --output table
  
  print_subheader "Storage Optimized"
  aws ec2 describe-instance-types --filters "Name=instance-type,Values=i3.*,i4.*,d2.*,d3.*,h1.*" --query 'InstanceTypes[*].[InstanceType,VCpuInfo.DefaultVCpus,MemoryInfo.SizeInMiB,NetworkInfo.NetworkPerformance]' --output table
  
  print_subheader "GPU Instances"
  aws ec2 describe-instance-types --filters "Name=instance-type,Values=p3.*,p4.*,g3.*,g4.*" --query 'InstanceTypes[*].[InstanceType,VCpuInfo.DefaultVCpus,MemoryInfo.SizeInMiB,NetworkInfo.NetworkPerformance]' --output table
}

# Function to get AMI information
get_amis() {
  print_header "Amazon Machine Images (AMIs)"
  
  print_subheader "Amazon Linux 2 AMIs"
  aws ec2 describe-images --owners amazon --filters "Name=name,Values=amzn2-ami-hvm-*-x86_64-gp2" "Name=state,Values=available" --query 'sort_by(Images, &CreationDate)[-5:].[ImageId,Name,CreationDate,Architecture]' --output table
  
  print_subheader "Ubuntu AMIs"
  aws ec2 describe-images --owners 099720109477 --filters "Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-*-amd64-server-*" "Name=state,Values=available" --query 'sort_by(Images, &CreationDate)[-5:].[ImageId,Name,CreationDate,Architecture]' --output table
  
  print_subheader "Windows Server AMIs"
  aws ec2 describe-images --owners amazon --filters "Name=name,Values=Windows_Server-*-English-*-Base-*" "Name=state,Values=available" --query 'sort_by(Images, &CreationDate)[-5:].[ImageId,Name,CreationDate,Architecture]' --output table
}

# Function to get security group information
get_security_groups() {
  print_header "Security Groups"
  
  local security_groups=$(aws ec2 describe-security-groups --query 'SecurityGroups[*].[GroupId,GroupName,Description,VpcId]' --output text)
  
  if [ -z "$security_groups" ]; then
    echo -e "${YELLOW}No security groups found.${NC}"
    return
  fi
  
  echo -e "${GREEN}Group ID${NC}\t\t${GREEN}Group Name${NC}\t\t${GREEN}Description${NC}\t\t${GREEN}VPC ID${NC}"
  echo -e "--------------------------------------------------------------------------------------------------------"
  
  echo "$security_groups" | while read -r line; do
    IFS=$'\t' read -r id name desc vpc <<< "$line"
    echo -e "$id\t$name\t$desc\t$vpc"
  done
}

# Function to get VPC information
get_vpcs() {
  print_header "Virtual Private Clouds (VPCs)"
  
  local vpcs=$(aws ec2 describe-vpcs --query 'Vpcs[*].[VpcId,CidrBlock,State,IsDefault]' --output text)
  
  if [ -z "$vpcs" ]; then
    echo -e "${YELLOW}No VPCs found.${NC}"
    return
  fi
  
  echo -e "${GREEN}VPC ID${NC}\t\t${GREEN}CIDR Block${NC}\t\t${GREEN}State${NC}\t\t${GREEN}Default${NC}"
  echo -e "--------------------------------------------------------------------------------------------------------"
  
  echo "$vpcs" | while read -r line; do
    IFS=$'\t' read -r id cidr state is_default <<< "$line"
    echo -e "$id\t$cidr\t$state\t$is_default"
  done
}

# Function to get subnet information
get_subnets() {
  print_header "Subnets"
  
  local subnets=$(aws ec2 describe-subnets --query 'Subnets[*].[SubnetId,VpcId,AvailabilityZone,CidrBlock,State,AvailableIpAddressCount]' --output text)
  
  if [ -z "$subnets" ]; then
    echo -e "${YELLOW}No subnets found.${NC}"
    return
  fi
  
  echo -e "${GREEN}Subnet ID${NC}\t\t${GREEN}VPC ID${NC}\t\t${GREEN}AZ${NC}\t\t${GREEN}CIDR${NC}\t\t${GREEN}State${NC}\t${GREEN}Available IPs${NC}"
  echo -e "--------------------------------------------------------------------------------------------------------"
  
  echo "$subnets" | while read -r line; do
    IFS=$'\t' read -r id vpc az cidr state ips <<< "$line"
    echo -e "$id\t$vpc\t$az\t$cidr\t$state\t$ips"
  done
}

# Function to get route table information
get_route_tables() {
  print_header "Route Tables"
  
  local route_tables=$(aws ec2 describe-route-tables --query 'RouteTables[*].[RouteTableId,VpcId,Associations[*].SubnetId|[0]]' --output text)
  
  if [ -z "$route_tables" ]; then
    echo -e "${YELLOW}No route tables found.${NC}"
    return
  fi
  
  echo -e "${GREEN}Route Table ID${NC}\t${GREEN}VPC ID${NC}\t\t${GREEN}Subnet ID${NC}"
  echo -e "--------------------------------------------------------------------------------------------------------"
  
  echo "$route_tables" | while read -r line; do
    IFS=$'\t' read -r id vpc subnet <<< "$line"
    echo -e "$id\t$vpc\t$subnet"
  done
}

# Function to get internet gateway information
get_internet_gateways() {
  print_header "Internet Gateways"
  
  local igws=$(aws ec2 describe-internet-gateways --query 'InternetGateways[*].[InternetGatewayId,Attachments[*].VpcId|[0],State]' --output text)
  
  if [ -z "$igws" ]; then
    echo -e "${YELLOW}No internet gateways found.${NC}"
    return
  fi
  
  echo -e "${GREEN}IGW ID${NC}\t\t${GREEN}VPC ID${NC}\t\t${GREEN}State${NC}"
  echo -e "--------------------------------------------------------------------------------------------------------"
  
  echo "$igws" | while read -r line; do
    IFS=$'\t' read -r id vpc state <<< "$line"
    echo -e "$id\t$vpc\t$state"
  done
}

# Function to get NAT gateway information
get_nat_gateways() {
  print_header "NAT Gateways"
  
  local nat_gateways=$(aws ec2 describe-nat-gateways --query 'NatGateways[*].[NatGatewayId,VpcId,SubnetId,State]' --output text)
  
  if [ -z "$nat_gateways" ]; then
    echo -e "${YELLOW}No NAT gateways found.${NC}"
    return
  fi
  
  echo -e "${GREEN}NAT Gateway ID${NC}\t${GREEN}VPC ID${NC}\t\t${GREEN}Subnet ID${NC}\t\t${GREEN}State${NC}"
  echo -e "--------------------------------------------------------------------------------------------------------"
  
  echo "$nat_gateways" | while read -r line; do
    IFS=$'\t' read -r id vpc subnet state <<< "$line"
    echo -e "$id\t$vpc\t$subnet\t$state"
  done
}

# Function to get elastic IP information
get_elastic_ips() {
  print_header "Elastic IPs"
  
  local eips=$(aws ec2 describe-addresses --query 'Addresses[*].[PublicIp,AllocationId,InstanceId,Domain]' --output text)
  
  if [ -z "$eips" ]; then
    echo -e "${YELLOW}No elastic IPs found.${NC}"
    return
  fi
  
  echo -e "${GREEN}Public IP${NC}\t\t${GREEN}Allocation ID${NC}\t${GREEN}Instance ID${NC}\t${GREEN}Domain${NC}"
  echo -e "--------------------------------------------------------------------------------------------------------"
  
  echo "$eips" | while read -r line; do
    IFS=$'\t' read -r ip alloc_id instance_id domain <<< "$line"
    echo -e "$ip\t$alloc_id\t$instance_id\t$domain"
  done
}

# Function to get key pair information
get_key_pairs() {
  print_header "Key Pairs"
  
  local key_pairs=$(aws ec2 describe-key-pairs --query 'KeyPairs[*].[KeyName,KeyFingerprint]' --output text)
  
  if [ -z "$key_pairs" ]; then
    echo -e "${YELLOW}No key pairs found.${NC}"
    return
  fi
  
  echo -e "${GREEN}Key Name${NC}\t\t${GREEN}Key Fingerprint${NC}"
  echo -e "--------------------------------------------------------------------------------------------------------"
  
  echo "$key_pairs" | while read -r line; do
    IFS=$'\t' read -r name fingerprint <<< "$line"
    echo -e "$name\t$fingerprint"
  done
}

# Function to get volume information
get_volumes() {
  print_header "EBS Volumes"
  
  local volumes=$(aws ec2 describe-volumes --query 'Volumes[*].[VolumeId,Size,VolumeType,State,AvailabilityZone]' --output text)
  
  if [ -z "$volumes" ]; then
    echo -e "${YELLOW}No EBS volumes found.${NC}"
    return
  fi
  
  echo -e "${GREEN}Volume ID${NC}\t\t${GREEN}Size (GB)${NC}\t${GREEN}Type${NC}\t\t${GREEN}State${NC}\t\t${GREEN>AZ${NC}"
  echo -e "--------------------------------------------------------------------------------------------------------"
  
  echo "$volumes" | while read -r line; do
    IFS=$'\t' read -r id size type state az <<< "$line"
    echo -e "$id\t$size\t$type\t$state\t$az"
  done
}

# Function to get snapshot information
get_snapshots() {
  print_header "EBS Snapshots"
  
  local snapshots=$(aws ec2 describe-snapshots --owner-ids self --query 'Snapshots[*].[SnapshotId,VolumeId,VolumeSize,State,StartTime]' --output text)
  
  if [ -z "$snapshots" ]; then
    echo -e "${YELLOW}No EBS snapshots found.${NC}"
    return
  fi
  
  echo -e "${GREEN}Snapshot ID${NC}\t${GREEN}Volume ID${NC}\t\t${GREEN}Size (GB)${NC}\t${GREEN>State${NC}\t\t${GREEN>Start Time${NC}"
  echo -e "--------------------------------------------------------------------------------------------------------"
  
  echo "$snapshots" | while read -r line; do
    IFS=$'\t' read -r id vol_id size state start_time <<< "$line"
    echo -e "$id\t$vol_id\t$size\t$state\t$start_time"
  done
}

# Function to get load balancer information
get_load_balancers() {
  print_header "Load Balancers"
  
  # Check if ELBv2 (Application/Network) is available
  if aws elbv2 describe-load-balancers &> /dev/null; then
    local elbv2=$(aws elbv2 describe-load-balancers --query 'LoadBalancers[*].[LoadBalancerArn,LoadBalancerName,Type,State.Code,Scheme]' --output text)
    
    if [ -n "$elbv2" ]; then
      print_subheader "Application/Network Load Balancers (ELBv2)"
      echo -e "${GREEN}ARN${NC}\t\t${GREEN}Name${NC}\t\t${GREEN>Type${NC}\t\t${GREEN>State${NC}\t\t${GREEN>Scheme${NC}"
      echo -e "--------------------------------------------------------------------------------------------------------"
      
      echo "$elbv2" | while read -r line; do
        IFS=$'\t' read -r arn name type state scheme <<< "$line"
        echo -e "$arn\t$name\t$type\t$state\t$scheme"
      done
    else
      echo -e "${YELLOW}No Application/Network Load Balancers found.${NC}"
    fi
  fi
  
  # Check if Classic ELB is available
  if aws elb describe-load-balancers &> /dev/null; then
    local classic=$(aws elb describe-load-balancers --query 'LoadBalancerDescriptions[*].[LoadBalancerName,DNSName,State]' --output text)
    
    if [ -n "$classic" ]; then
      print_subheader "Classic Load Balancers"
      echo -e "${GREEN}Name${NC}\t\t${GREEN>DNS Name${NC}\t\t${GREEN>State${NC}"
      echo -e "--------------------------------------------------------------------------------------------------------"
      
      echo "$classic" | while read -r line; do
        IFS=$'\t' read -r name dns state <<< "$line"
        echo -e "$name\t$dns\t$state"
      done
    else
      echo -e "${YELLOW}No Classic Load Balancers found.${NC}"
    fi
  fi
}

# Function to get auto scaling group information
get_auto_scaling_groups() {
  print_header "Auto Scaling Groups"
  
  if aws autoscaling describe-auto-scaling-groups &> /dev/null; then
    local asgs=$(aws autoscaling describe-auto-scaling-groups --query 'AutoScalingGroups[*].[AutoScalingGroupName,MinSize,MaxSize,DesiredCapacity,LaunchTemplate.LaunchTemplateId]' --output text)
    
    if [ -n "$asgs" ]; then
      echo -e "${GREEN}ASG Name${NC}\t\t${GREEN>Min Size${NC}\t${GREEN>Max Size${NC}\t${GREEN>Desired${NC}\t${GREEN>Launch Template${NC}"
      echo -e "--------------------------------------------------------------------------------------------------------"
      
      echo "$asgs" | while read -r line; do
        IFS=$'\t' read -r name min max desired template <<< "$line"
        echo -e "$name\t$min\t$max\t$desired\t$template"
      done
    else
      echo -e "${YELLOW}No Auto Scaling Groups found.${NC}"
    fi
  else
    echo -e "${YELLOW}Auto Scaling service is not available.${NC}"
  fi
}

# Function to get launch template information
get_launch_templates() {
  print_header "Launch Templates"
  
  if aws ec2 describe-launch-templates &> /dev/null; then
    local templates=$(aws ec2 describe-launch-templates --query 'LaunchTemplates[*].[LaunchTemplateId,LaunchTemplateName,DefaultVersionNumber,LatestVersionNumber]' --output text)
    
    if [ -n "$templates" ]; then
      echo -e "${GREEN}Template ID${NC}\t${GREEN>Name${NC}\t\t${GREEN>Default Version${NC}\t${GREEN>Latest Version${NC}"
      echo -e "--------------------------------------------------------------------------------------------------------"
      
      echo "$templates" | while read -r line; do
        IFS=$'\t' read -r id name default_ver latest_ver <<< "$line"
        echo -e "$id\t$name\t$default_ver\t$latest_ver"
      done
    else
      echo -e "${YELLOW}No Launch Templates found.${NC}"
    fi
  else
    echo -e "${YELLOW}Launch Templates service is not available.${NC}"
  fi
}

# Function to get placement group information
get_placement_groups() {
  print_header "Placement Groups"
  
  local placement_groups=$(aws ec2 describe-placement-groups --query 'PlacementGroups[*].[GroupName,Strategy,State]' --output text)
  
  if [ -z "$placement_groups" ]; then
    echo -e "${YELLOW}No placement groups found.${NC}"
    return
  fi
  
  echo -e "${GREEN}Group Name${NC}\t\t${GREEN>Strategy${NC}\t\t${GREEN>State${NC}"
  echo -e "--------------------------------------------------------------------------------------------------------"
  
  echo "$placement_groups" | while read -r line; do
    IFS=$'\t' read -r name strategy state <<< "$line"
    echo -e "$name\t$strategy\t$state"
  done
}

# Function to get spot instance request information
get_spot_requests() {
  print_header "Spot Instance Requests"
  
  local spot_requests=$(aws ec2 describe-spot-instance-requests --query 'SpotInstanceRequests[*].[SpotInstanceRequestId,InstanceId,State,Type,SpotPrice]' --output text)
  
  if [ -z "$spot_requests" ]; then
    echo -e "${YELLOW}No spot instance requests found.${NC}"
    return
  fi
  
  echo -e "${GREEN}Request ID${NC}\t\t${GREEN>Instance ID${NC}\t${GREEN>State${NC}\t\t${GREEN>Type${NC}\t\t${GREEN>Spot Price${NC}"
  echo -e "--------------------------------------------------------------------------------------------------------"
  
  echo "$spot_requests" | while read -r line; do
    IFS=$'\t' read -r req_id instance_id state type price <<< "$line"
    echo -e "$req_id\t$instance_id\t$state\t$type\t$price"
  done
}

# Function to get reserved instance information
get_reserved_instances() {
  print_header "Reserved Instances"
  
  local reserved_instances=$(aws ec2 describe-reserved-instances --query 'ReservedInstances[*].[ReservedInstancesId,InstanceType,State,OfferingType,InstanceCount]' --output text)
  
  if [ -z "$reserved_instances" ]; then
    echo -e "${YELLOW}No reserved instances found.${NC}"
    return
  fi
  
  echo -e "${GREEN>Reservation ID${NC}\t${GREEN>Instance Type${NC}\t${GREEN>State${NC}\t\t${GREEN>Offering Type${NC}\t${GREEN>Count${NC}"
  echo -e "--------------------------------------------------------------------------------------------------------"
  
  echo "$reserved_instances" | while read -r line; do
    IFS=$'\t' read -r res_id instance_type state offering_type count <<< "$line"
    echo -e "$res_id\t$instance_type\t$state\t$offering_type\t$count"
  done
}

# Function to get capacity reservation information
get_capacity_reservations() {
  print_header "Capacity Reservations"
  
  if aws ec2 describe-capacity-reservations &> /dev/null; then
    local capacity_reservations=$(aws ec2 describe-capacity-reservations --query 'CapacityReservations[*].[CapacityReservationId,InstanceType,State,InstancePlatform,InstanceCount]' --output text)
    
    if [ -n "$capacity_reservations" ]; then
      echo -e "${GREEN>Reservation ID${NC}\t${GREEN>Instance Type${NC}\t${GREEN>State${NC}\t\t${GREEN>Platform${NC}\t\t${GREEN>Count${NC}"
      echo -e "--------------------------------------------------------------------------------------------------------"
      
      echo "$capacity_reservations" | while read -r line; do
        IFS=$'\t' read -r res_id instance_type state platform count <<< "$line"
        echo -e "$res_id\t$instance_type\t$state\t$platform\t$count"
      done
    else
      echo -e "${YELLOW}No capacity reservations found.${NC}"
    fi
  else
    echo -e "${YELLOW}Capacity Reservations service is not available.${NC}"
  fi
}

# Function to get dedicated host information
get_dedicated_hosts() {
  print_header "Dedicated Hosts"
  
  local dedicated_hosts=$(aws ec2 describe-hosts --query 'Hosts[*].[HostId,State,InstanceType,AvailabilityZone]' --output text)
  
  if [ -z "$dedicated_hosts" ]; then
    echo -e "${YELLOW}No dedicated hosts found.${NC}"
    return
  fi
  
  echo -e "${GREEN>Host ID${NC}\t\t${GREEN>State${NC}\t\t${GREEN>Instance Type${NC}\t${GREEN>AZ${NC}"
  echo -e "--------------------------------------------------------------------------------------------------------"
  
  echo "$dedicated_hosts" | while read -r line; do
    IFS=$'\t' read -r host_id state instance_type az <<< "$line"
    echo -e "$host_id\t$state\t$instance_type\t$az"
  done
}

# Function to get fleet information
get_fleets() {
  print_header "EC2 Fleets"
  
  if aws ec2 describe-fleets &> /dev/null; then
    local fleets=$(aws ec2 describe-fleets --query 'Fleets[*].[FleetId,State,TargetCapacity,Type]' --output text)
    
    if [ -n "$fleets" ]; then
      echo -e "${GREEN>Fleet ID${NC}\t\t${GREEN>State${NC}\t\t${GREEN>Target Capacity${NC}\t${GREEN>Type${NC}"
      echo -e "--------------------------------------------------------------------------------------------------------"
      
      echo "$fleets" | while read -r line; do
        IFS=$'\t' read -r fleet_id state target_capacity type <<< "$line"
        echo -e "$fleet_id\t$state\t$target_capacity\t$type"
      done
    else
      echo -e "${YELLOW}No EC2 fleets found.${NC}"
    fi
  else
    echo -e "${YELLOW}EC2 Fleets service is not available.${NC}"
  fi
}

# Function to get transit gateway information
get_transit_gateways() {
  print_header "Transit Gateways"
  
  if aws ec2 describe-transit-gateways &> /dev/null; then
    local transit_gateways=$(aws ec2 describe-transit-gateways --query 'TransitGateways[*].[TransitGatewayId,State,OwnerId]' --output text)
    
    if [ -n "$transit_gateways" ]; then
      echo -e "${GREEN>Gateway ID${NC}\t\t${GREEN>State${NC}\t\t${GREEN>Owner ID${NC}"
      echo -e "--------------------------------------------------------------------------------------------------------"
      
      echo "$transit_gateways" | while read -r line; do
        IFS=$'\t' read -r gateway_id state owner_id <<< "$line"
        echo -e "$gateway_id\t$state\t$owner_id"
      done
    else
      echo -e "${YELLOW}No Transit Gateways found.${NC}"
    fi
  else
    echo -e "${YELLOW}Transit Gateways service is not available.${NC}"
  fi
}

# Function to get VPN connection information
get_vpn_connections() {
  print_header "VPN Connections"
  
  local vpn_connections=$(aws ec2 describe-vpn-connections --query 'VpnConnections[*].[VpnConnectionId,State,Type,VpnGatewayId]' --output text)
  
  if [ -z "$vpn_connections" ]; then
    echo -e "${YELLOW}No VPN connections found.${NC}"
    return
  fi
  
  echo -e "${GREEN>Connection ID${NC}\t${GREEN>State${NC}\t\t${GREEN>Type${NC}\t\t${GREEN>Gateway ID${NC}"
  echo -e "--------------------------------------------------------------------------------------------------------"
  
  echo "$vpn_connections" | while read -r line; do
    IFS=$'\t' read -r conn_id state type gateway_id <<< "$line"
    echo -e "$conn_id\t$state\t$type\t$gateway_id"
  done
}

# Function to get customer gateway information
get_customer_gateways() {
  print_header "Customer Gateways"
  
  local customer_gateways=$(aws ec2 describe-customer-gateways --query 'CustomerGateways[*].[CustomerGatewayId,State,IpAddress]' --output text)
  
  if [ -z "$customer_gateways" ]; then
    echo -e "${YELLOW}No customer gateways found.${NC}"
    return
  fi
  
  echo -e "${GREEN>Gateway ID${NC}\t\t${GREEN>State${NC}\t\t${GREEN>IP Address${NC}"
  echo -e "--------------------------------------------------------------------------------------------------------"
  
  echo "$customer_gateways" | while read -r line; do
    IFS=$'\t' read -r gateway_id state ip_address <<< "$line"
    echo -e "$gateway_id\t$state\t$ip_address"
  done
}

# Function to get DHCP options information
get_dhcp_options() {
  print_header "DHCP Options"
  
  local dhcp_options=$(aws ec2 describe-dhcp-options --query 'DhcpOptions[*].[DhcpOptionsId,DomainNameServers[*].Values[*]|[0]]' --output text)
  
  if [ -z "$dhcp_options" ]; then
    echo -e "${YELLOW}No DHCP options found.${NC}"
    return
  fi
  
  echo -e "${GREEN>Options ID${NC}\t\t${GREEN>DNS Servers${NC}"
  echo -e "--------------------------------------------------------------------------------------------------------"
  
  echo "$dhcp_options" | while read -r line; do
    IFS=$'\t' read -r options_id dns_servers <<< "$line"
    echo -e "$options_id\t$dns_servers"
  done
}

# Function to get network ACL information
get_network_acls() {
  print_header "Network ACLs"
  
  local network_acls=$(aws ec2 describe-network-acls --query 'NetworkAcls[*].[NetworkAclId,VpcId,IsDefault]' --output text)
  
  if [ -z "$network_acls" ]; then
    echo -e "${YELLOW}No network ACLs found.${NC}"
    return
  fi
  
  echo -e "${GREEN>ACL ID${NC}\t\t${GREEN>VPC ID${NC}\t\t${GREEN>Default${NC}"
  echo -e "--------------------------------------------------------------------------------------------------------"
  
  echo "$network_acls" | while read -r line; do
    IFS=$'\t' read -r acl_id vpc_id is_default <<< "$line"
    echo -e "$acl_id\t$vpc_id\t$is_default"
  done
}

# Function to get IAM role information
get_iam_roles() {
  print_header "IAM Roles for EC2"
  
  if aws iam list-roles &> /dev/null; then
    local roles=$(aws iam list-roles --query 'Roles[?contains(AssumeRolePolicyDocument, `ec2.amazonaws.com`)].RoleName' --output text)
    
    if [ -n "$roles" ]; then
      echo -e "${GREEN>Role Name${NC}"
      echo -e "--------------------------------------------------------------------------------------------------------"
      
      echo "$roles" | while read -r role_name; do
        echo -e "$role_name"
      done
    else
      echo -e "${YELLOW}No IAM roles for EC2 found.${NC}"
    fi
  else
    echo -e "${YELLOW}IAM service is not available.${NC}"
  fi
}

# Function to get instance profile information
get_instance_profiles() {
  print_header "Instance Profiles"
  
  if aws iam list-instance-profiles &> /dev/null; then
    local profiles=$(aws iam list-instance-profiles --query 'InstanceProfiles[*].[InstanceProfileName,InstanceProfileId]' --output text)
    
    if [ -n "$profiles" ]; then
      echo -e "${GREEN>Profile Name${NC}\t\t${GREEN>Profile ID${NC}"
      echo -e "--------------------------------------------------------------------------------------------------------"
      
      echo "$profiles" | while read -r line; do
        IFS=$'\t' read -r name id <<< "$line"
        echo -e "$name\t$id"
      done
    else
      echo -e "${YELLOW}No instance profiles found.${NC}"
    fi
  else
    echo -e "${YELLOW}IAM service is not available.${NC}"
  fi
}

# Function to get CloudWatch alarms for EC2
get_cloudwatch_alarms() {
  print_header "CloudWatch Alarms for EC2"
  
  if aws cloudwatch describe-alarms &> /dev/null; then
    local alarms=$(aws cloudwatch describe-alarms --query 'MetricAlarms[?contains(Namespace, `AWS/EC2`)].AlarmName' --output text)
    
    if [ -n "$alarms" ]; then
      echo -e "${GREEN>Alarm Name${NC}"
      echo -e "--------------------------------------------------------------------------------------------------------"
      
      echo "$alarms" | while read -r alarm_name; do
        echo -e "$alarm_name"
      done
    else
      echo -e "${YELLOW}No CloudWatch alarms for EC2 found.${NC}"
    fi
  else
    echo -e "${YELLOW}CloudWatch service is not available.${NC}"
  fi
}

# Main function to run all checks
main() {
  print_header "AWS EC2 Features Review"
  echo -e "This script provides a comprehensive overview of all functional features in AWS EC2."
  echo -e "Date: $(date)"
  echo -e "Region: $(aws configure get region)"
  
  # Check prerequisites
  check_aws_cli
  check_aws_credentials
  
  # Get account information
  get_account_info
  
  # Get EC2 instance information
  get_ec2_instances
  
  # Get EC2 instance types
  get_instance_types
  
  # Get AMI information
  get_amis
  
  # Get security group information
  get_security_groups
  
  # Get VPC information
  get_vpcs
  
  # Get subnet information
  get_subnets
  
  # Get route table information
  get_route_tables
  
  # Get internet gateway information
  get_internet_gateways
  
  # Get NAT gateway information
  get_nat_gateways
  
  # Get elastic IP information
  get_elastic_ips
  
  # Get key pair information
  get_key_pairs
  
  # Get volume information
  get_volumes
  
  # Get snapshot information
  get_snapshots
  
  # Get load balancer information
  get_load_balancers
  
  # Get auto scaling group information
  get_auto_scaling_groups
  
  # Get launch template information
  get_launch_templates
  
  # Get placement group information
  get_placement_groups
  
  # Get spot instance request information
  get_spot_requests
  
  # Get reserved instance information
  get_reserved_instances
  
  # Get capacity reservation information
  get_capacity_reservations
  
  # Get dedicated host information
  get_dedicated_hosts
  
  # Get fleet information
  get_fleets
  
  # Get transit gateway information
  get_transit_gateways
  
  # Get VPN connection information
  get_vpn_connections
  
  # Get customer gateway information
  get_customer_gateways
  
  # Get DHCP options information
  get_dhcp_options
  
  # Get network ACL information
  get_network_acls
  
  # Get IAM role information
  get_iam_roles
  
  # Get instance profile information
  get_instance_profiles
  
  # Get CloudWatch alarms for EC2
  get_cloudwatch_alarms
  
  print_header "EC2 Features Review Complete"
  echo -e "Thank you for using the AWS EC2 Features Review script."
}

# Run the main function
main 