terraform {
  backend "azurerm" {
    resource_group_name  = "rg-tfstate-<%= env %>-eastus2"
    storage_account_name = "sttfstate<%= env %>eastus2"
    container_name       = "tfstate"
    key                  = "<%= app %>.<%= env %>.tfstate"
  }
}
