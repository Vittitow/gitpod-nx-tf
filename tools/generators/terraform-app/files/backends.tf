terraform {
#   backend "azurerm" {
#     resource_group_name  = "rg-tfstate-<%= tf_app_env %>-eastus2"
#     storage_account_name = "sttfstate<%= tf_app_env %>eastus2"
#     container_name       = "tfstate"
#     key                  = "<%= app %>.<%= tf_app_env %>.tfstate"
#   }
}