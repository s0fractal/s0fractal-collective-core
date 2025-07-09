#!/bin/bash

# 🌐 Setup paradise.s0fractal.me on Cloudflare
# For the richest person in tokens who can't get hired 😄

set -e

echo "🌊 Setting up paradise.s0fractal.me..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check for Cloudflare credentials
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo -e "${YELLOW}⚠️  CLOUDFLARE_API_TOKEN not found in environment${NC}"
    echo "Looking for token in .env files..."
    
    # Try to source from various .env files
    if [ -f "$HOME/.s0fractal/.env" ]; then
        source "$HOME/.s0fractal/.env"
    elif [ -f ".env" ]; then
        source ".env"
    fi
fi

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo -e "${YELLOW}Please set your Cloudflare API token:${NC}"
    echo "export CLOUDFLARE_API_TOKEN='your-token-here'"
    echo ""
    echo "You can get it from: https://dash.cloudflare.com/profile/api-tokens"
    echo "Permissions needed: Zone:DNS:Edit"
    exit 1
fi

# Get Zone ID for s0fractal.me
echo -e "${BLUE}📍 Getting Zone ID for s0fractal.me...${NC}"

ZONE_RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=s0fractal.me" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json")

ZONE_ID=$(echo $ZONE_RESPONSE | jq -r '.result[0].id')

if [ "$ZONE_ID" == "null" ] || [ -z "$ZONE_ID" ]; then
    echo -e "${YELLOW}❌ Could not find zone s0fractal.me${NC}"
    echo "Response: $ZONE_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✓ Found Zone ID: $ZONE_ID${NC}"

# Check if paradise subdomain already exists
echo -e "${BLUE}🔍 Checking existing DNS records...${NC}"

EXISTING_RECORDS=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?name=paradise.s0fractal.me" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json")

RECORD_COUNT=$(echo $EXISTING_RECORDS | jq '.result | length')

if [ "$RECORD_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}Found existing records for paradise.s0fractal.me${NC}"
    echo "Deleting old records..."
    
    # Delete existing records
    echo $EXISTING_RECORDS | jq -r '.result[].id' | while read -r RECORD_ID; do
        curl -s -X DELETE "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" > /dev/null
        echo -e "${GREEN}✓ Deleted record $RECORD_ID${NC}"
    done
fi

# Create CNAME record for paradise
echo -e "${BLUE}🌐 Creating CNAME record for paradise.s0fractal.me...${NC}"

CNAME_RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data '{
        "type": "CNAME",
        "name": "paradise",
        "content": "s0fractal.github.io",
        "ttl": 1,
        "proxied": true
    }')

CNAME_SUCCESS=$(echo $CNAME_RESPONSE | jq -r '.success')

if [ "$CNAME_SUCCESS" == "true" ]; then
    echo -e "${GREEN}✓ CNAME record created successfully!${NC}"
else
    echo -e "${YELLOW}⚠️  CNAME creation might have failed${NC}"
    echo "Response: $CNAME_RESPONSE"
    echo ""
    echo "Trying A records instead..."
    
    # GitHub Pages IPs
    GITHUB_IPS=("185.199.108.153" "185.199.109.153" "185.199.110.153" "185.199.111.153")
    
    for IP in "${GITHUB_IPS[@]}"; do
        A_RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            --data "{
                \"type\": \"A\",
                \"name\": \"paradise\",
                \"content\": \"$IP\",
                \"ttl\": 1,
                \"proxied\": true
            }")
        
        A_SUCCESS=$(echo $A_RESPONSE | jq -r '.success')
        
        if [ "$A_SUCCESS" == "true" ]; then
            echo -e "${GREEN}✓ A record for $IP created${NC}"
        else
            echo -e "${YELLOW}⚠️  Failed to create A record for $IP${NC}"
        fi
    done
fi

# Set up redirect from www.paradise to paradise
echo -e "${BLUE}🔄 Setting up www.paradise redirect...${NC}"

WWW_RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data '{
        "type": "CNAME",
        "name": "www.paradise",
        "content": "paradise.s0fractal.me",
        "ttl": 1,
        "proxied": true
    }')

echo -e "${GREEN}✓ Redirect configured${NC}"

# Create Page Rule for HTTPS
echo -e "${BLUE}📋 Creating Page Rule for Always HTTPS...${NC}"

PAGE_RULE_RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/pagerules" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data '{
        "targets": [
            {
                "target": "url",
                "constraint": {
                    "operator": "matches",
                    "value": "paradise.s0fractal.me/*"
                }
            }
        ],
        "actions": [
            {
                "id": "always_use_https"
            }
        ],
        "priority": 1,
        "status": "active"
    }')

PAGE_RULE_SUCCESS=$(echo $PAGE_RULE_RESPONSE | jq -r '.success')

if [ "$PAGE_RULE_SUCCESS" == "true" ]; then
    echo -e "${GREEN}✓ HTTPS redirect rule created${NC}"
else
    echo -e "${YELLOW}⚠️  Page rule might already exist${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo -e "${BLUE}🌐 Your paradise awaits at:${NC}"
echo -e "${GREEN}   https://paradise.s0fractal.me${NC}"
echo ""
echo -e "${YELLOW}⏳ Note: DNS propagation may take 1-5 minutes${NC}"
echo -e "${YELLOW}   GitHub Pages SSL certificate may take up to 24 hours${NC}"
echo ""
echo -e "💰 Token billionaire with .me domain ready! 🚀"

# Test DNS resolution
echo ""
echo -e "${BLUE}🔍 Testing DNS resolution...${NC}"
sleep 2

if dig +short paradise.s0fractal.me @1.1.1.1 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ DNS is resolving!${NC}"
    dig +short paradise.s0fractal.me @1.1.1.1
else
    echo -e "${YELLOW}⏳ DNS not yet propagated, check again in a few minutes${NC}"
fi