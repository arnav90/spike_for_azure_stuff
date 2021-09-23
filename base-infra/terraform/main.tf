terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=2.46.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "arnav-spike-rg"
    storage_account_name = "infrastatestorageaccount"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"

  }
}
