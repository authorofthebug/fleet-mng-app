#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# API base URL
API_BASE_URL="https://ntqxil0tx4.execute-api.us-east-1.amazonaws.com/dev"

# Function to make API requests and format the response
test_endpoint() {
  local endpoint=$1
  local description=$2
  local method=${3:-GET}
  local data=$4
  
  echo -e "${BLUE}Testing: ${description}${NC}"
  echo -e "${BLUE}Endpoint: ${method} ${endpoint}${NC}"
  
  # Make the request based on method
  if [ "$method" = "GET" ]; then
    response=$(curl -s "${API_BASE_URL}${endpoint}")
  elif [ "$method" = "POST" ]; then
    echo -e "${BLUE}Data: ${data}${NC}"
    response=$(curl -s -X POST "${API_BASE_URL}${endpoint}" \
      -H "Content-Type: application/json" \
      -d "${data}")
  elif [ "$method" = "PUT" ]; then
    echo -e "${BLUE}Data: ${data}${NC}"
    response=$(curl -s -X PUT "${API_BASE_URL}${endpoint}" \
      -H "Content-Type: application/json" \
      -d "${data}")
  elif [ "$method" = "DELETE" ]; then
    response=$(curl -s -X DELETE "${API_BASE_URL}${endpoint}")
  fi
  
  # Check if the response is valid JSON
  if echo "$response" | jq . >/dev/null 2>&1; then
    echo -e "${GREEN}Success!${NC}"
    echo "$response" | jq .
  else
    echo -e "${RED}Error: Invalid JSON response${NC}"
    echo "$response"
  fi
  
  echo -e "\n-----------------------------------\n"
}

# Main function
main() {
  echo -e "${BLUE}Vehicle API Integration Tests${NC}"
  echo -e "Base URL: ${API_BASE_URL}\n"
  
  # Test GET all vehicles
  test_endpoint "/vehicle" "Get all vehicles"
  
  # Get the first vehicle ID from the list for testing
  first_id=$(curl -s "${API_BASE_URL}/vehicle" | jq -r '.[0].id')
  
  if [ -n "$first_id" ] && [ "$first_id" != "null" ]; then
    # Test GET vehicle by ID (using the first ID from the list)
    test_endpoint "/vehicle/${first_id}" "Get vehicle by ID (${first_id})"
  else
    echo -e "${RED}No vehicle IDs found to test individual vehicle endpoint${NC}"
  fi
  
  # Test POST to create a new vehicle
  test_endpoint "/vehicle" "Create new vehicle" "POST" '{"licensePlate":"TEST123","brand":"TestBrand","model":"TestModel","year":"2023","color":"Blue","status":"ACTIVE","notes":"Test vehicle"}'
  
  echo -e "${BLUE}Tests completed.${NC}"
}

# Check if jq is installed
if ! command -v jq &> /dev/null; then
  echo -e "${RED}Error: jq is not installed.${NC}"
  echo "Please install it using: sudo apt-get install jq (Ubuntu/Debian) or brew install jq (macOS)"
  exit 1
fi

# Run the main function
main