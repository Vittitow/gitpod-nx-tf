data "terraform_remote_state" "intapis_shared" {
  backend = "azurerm"

  config = {
    resource_group_name  = "rg-tfstate-<%- env %>-eastus2"
    storage_account_name = "sttfstate<%- env %>eastus2"
    container_name       = "tfstate"
    key                  = "intapis-shared.<%- env %>.tfstate"
  }
}

data "terraform_remote_state" "intapis_core" {
  backend = "azurerm"

  config = {
    resource_group_name  = "rg-tfstate-<%- env %>-eastus2"
    storage_account_name = "sttfstate<%- env %>eastus2"
    container_name       = "tfstate"
    key                  = "intapis-core.<%- env %>.tfstate"
  }
}
