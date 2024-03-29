# ThingsWeb 

## Infrastructure as Code using Azure CLI 

### Initialise variables

```
RG="thingz-rg"
LOCATION="uksouth"
PLANNAME="appserviceplan"
APPNAME="thingz"
THINGSAPIURL="https://??????.azurewebsites.net"

```

### Create a RG - if needed

```
az group create -g $RG -l $LOCATION  -o table 

```

### Create a AppService Plan - if needed

```
az appservice plan create -g $RG  \
  --name $PLANNAME \
  --is-linux \
  --number-of-workers 1 \
  --sku B1

```   

### Create AppService and configure

```
az webapp create -g $RG -p $PLANNAME -n $APPNAME --runtime DOTNETCORE:6.0

az webapp stop -g $RG -n $APPNAME

az webapp config appsettings set -g $RG -n $APPNAME --settings \
 ThingsAPIUrl=$THINGSAPIURL \
 AdminPW="????????" \
 MapSKey="????" \
 MapSKeyAzure="????" \
 MapSKeyBing="????" \
 MapSource="Bing" \
 MapStartLat="52.5" \
 MapStartLong="-1.0" \
 MapStartZoom="7.0"


az webapp config container set -g $RG -n $APPNAME \
  --docker-custom-image-name https://ghcr.io/markharrison/thingsweb:latest \
  --docker-registry-server-url https://ghcr.io \
  --docker-registry-server-user markharrison \
  --docker-registry-server-password ???? 

az webapp start -g $RG -n $APPNAME

```