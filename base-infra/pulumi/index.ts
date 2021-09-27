import * as resources from "@pulumi/azure-native/resources";
import * as network from "@pulumi/azure-native/network";
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
})