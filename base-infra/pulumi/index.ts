import * as resources from "@pulumi/azure-native/resources";
import * as network from "@pulumi/azure-native/network";
import * as storage from "@pulumi/azure-native/storage";
import * as operationalInsights from "@pulumi/azure-native/operationalinsights";
import * as azure from "@pulumi/azure";
import * as azureNative from "@pulumi/azure-native";
import {tags} from "./tags";

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup("arnavku-pulumi-spike");


//Network Setup
const IngressPublicIp = new network.PublicIPAddress("ingress-public-ip", {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    publicIPAllocationMethod: "Static",
    sku: {
        name: "Standard",
    },
    tags: tags
});

const EgressPublicIp = new network.PublicIPAddress("egress-public-ip", {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    publicIPAllocationMethod: "Static",
    sku: {
        name: "Standard",
    },
    tags: tags

});

const NatGateway = new network.NatGateway("romanoff", {
    location: resourceGroup.location,
    publicIpAddresses: [
        {
            id: EgressPublicIp.id
        },
    ],
    resourceGroupName: resourceGroup.name,
    sku: {
        name: "Standard",
    },
    tags: tags
});

const Vnet = new network.VirtualNetwork("regional-defence-force-training-network",{
    addressSpace: {
        addressPrefixes: ["10.0.0.0/16"],
    },
    location: resourceGroup.location,
    resourceGroupName: resourceGroup.name,
    tags: tags,
});


//Monitoring Setup for Azure Function Apps
const LoW = new operationalInsights.Workspace("analytics-workspace-pulumi",{
    location: resourceGroup.location,
    provisioningState: undefined,
    publicNetworkAccessForIngestion: undefined,
    publicNetworkAccessForQuery: undefined,
    resourceGroupName: resourceGroup.name,
    retentionInDays: 30,
    sku: {
        name: "pergb2018"
    },
    tags: tags
});

const AppInsights = new azure.appinsights.Insights("app-insights-pulumi", {
    location: resourceGroup.location,
    resourceGroupName: resourceGroup.name,
    retentionInDays: 30,
    tags: tags,
    workspaceId: LoW.id,
    applicationType: "web"
});

//Storage Account for Azure Function App
const StorageAccount = new storage.StorageAccount("pulumi-sa", {
    kind: "StorageV2",
    resourceGroupName: resourceGroup.name,
    sku: {
        name: "Standard_GRS"
    },
    location: resourceGroup.location,
    tags: tags,
    accountName: "pulumisa"

});

//Service Plan
const appServicePlan = new azureNative.web.AppServicePlan("pulumi-app-plan",{
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    kind: "Linux",
    reserved: true,
    sku: {
        tier: "Standard",
        size: "S1",
        name: "S1"
    }
});

export const appInsightsPulumiInstrumentationKey = AppInsights.instrumentationKey;
export const pulumiAppId = AppInsights.appId;