
output "pet1" {
  description = "pet1"
  value       = module.l1.pet
}

output "pet2" {
  description = "pet2"
  value       = module.l2.pet
}

output "l2lenght" {
  description = "l2 length"
  value       = module.l2.length
}