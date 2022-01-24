output "intapis_core_resource_group_name" {
  value       = data.terraform_remote_state.intapis_core.resource_group_name
  description = "intapis-core remote state resource group name"
}

output "intapis_shared_resource_group_name" {
  value       = data.terraform_remote_state.intapis_shared.resource_group_name
  description = "intapis-shared remote state resource group name"
}
