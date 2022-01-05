# terraform {
#   backend "azurerm" {
#     resource_group_name  = "rg-tfstate-sandbox-eastus2"
#     storage_account_name = "sttfstatesandboxeastus2"
#     container_name       = "tfstate"
#     key                  = "a2.tfstate"
#   }
# }