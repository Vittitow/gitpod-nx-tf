# resource "random_pet" "pet" {
#   length = var.length
# }

module "azurerm" {
  source = "../../../../libs/littleip/src"
}
