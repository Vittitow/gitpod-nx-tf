# resource "random_pet" "pet" {
#   length = var.length
# }

module "mylib" {
  source = "../../../libs/mylib/src"
}
