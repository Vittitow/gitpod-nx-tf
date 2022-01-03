module "l1" {
  source = "../../libs/l1"

  length = var.length1
}

module "l2" {
  source = "../../libs/l2"

  length = var.length2
}
