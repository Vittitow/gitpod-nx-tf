# terraform {
#   backend "azurerm" {
#     resource_group_name  = "rg-tfstate-np-eastus2"
#     storage_account_name = "sttfstatenpeastus2"
#     container_name       = "tfstate"
#     key                  = "a2.np.tfstate"
#   }
# }