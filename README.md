

# Nx Terraform
### Extends the nx project graph to detect dependencies between terraform hcl code projects. Additionally adds custom workspace generators and executors to streamline monorepo development of terraform modules.
&nbsp;

# Workspace Generators

## Terraform App
```bash
nx workspace-generator terraform-app myapp # Optional flag: --dry-run to see output without actually creating app

CREATE apps/myapp/project.json
UPDATE workspace.json
CREATE apps/myapp/src/.terraform-docs.yml
CREATE apps/myapp/src/.tflint.hcl
CREATE apps/myapp/src/main.tf
CREATE apps/myapp/src/outputs.tf
CREATE apps/myapp/src/variables.tf
CREATE apps/myapp/src/versions.tf
CREATE apps/myapp/src/backends.tf
CREATE apps/myapp/src/providers.tf
```

## Terraform App Env
```bash
nx workspace-generator terraform-app-env myapp myenv # Optional flag: --dry-run to see output without actually creating app-env

CREATE apps/myapp/env/myenv/.env
CREATE apps/myapp/env/myenv/myenv.auto.tfvars
```

## Terraform Lib
```bash
nx workspace-generator terraform-lib mylib # Optional flag: --dry-run to see output without actually creating lib

CREATE libs/mylib/project.json
UPDATE workspace.json
CREATE libs/mylib/src/.terraform-docs.yml
CREATE libs/mylib/src/.tflint.hcl
CREATE libs/mylib/src/main.tf
CREATE libs/mylib/src/outputs.tf
CREATE libs/mylib/src/variables.tf
CREATE libs/mylib/src/versions.tf
```

# Workspace Executors

## Lint
```bash
nx lint app1 # Optional flag: --skip-nx-cache to bypass cache
nx run app1:lint # Optional flag: --skip-nx-cache to bypass cache
nx affected:lint
```

 - Runs `terraform fmt -recursive` to formate terraform code properly
 - Runs `tflint init && tflint` to install tflint plugins and perform linting
 - Runs `terraform-docs .` to generate up to date documentation on the terraform code

## Build
```bash
nx build app1 # Optional flags: --skip-nx-cache to bypass cache and --environments=myenv to build specific environment(s)
nx run app1:build # Optional flags: --skip-nx-cache to bypass cache and --environments=myenv to build specific environment(s)
nx affected:build
```

- Iterates through each environment performing the following:
    - Copies all files to a dist folder and uses ejs to generate values
    - Runs `tfenv install min-required && tfenv use min-required` to utilize the correct terraform version
    - Runs `terraform init -backend=false && terraform validate` to validate the terraform code
    - Runs `tfsec --tfvars-file=` to perform static code analysis

## Plan
```bash
nx plan app1 # Optional flags: --skip-nx-cache to bypass cache and --environments=myenv to plan specific environment(s)
nx run app1:plan # Optional flags: --skip-nx-cache to bypass cache and --environments=myenv to plan specific environment(s)
nx affected:plan
```

- Iterates through each environment performing the following:
    - Runs `tfenv install min-required && tfenv use min-required` to utilize the correct terraform version
    - Runs `terraform init && terraform plan -out=terraform.tfplan` to plan the terraform code and output the plan file

## Apply
```bash
nx apply app1 --environments=myenv # Optional flag: --skip-nx-cache to bypass cache
nx run app1:apply --environments=myenv # Optional flag: --skip-nx-cache to bypass cache
nx affected:apply --environments=myenv
```

- Iterates through each environment performing the following:
    - Runs `tfenv install min-required && tfenv use min-required` to utilize the correct terraform version
    - Runs `terraform init && terraform apply -input=false terraform.tfplan` to apply the output plan taking no input

# Additional Commands

## Graph
```bash
nx graph
nx graph --watch # Updates the browser as code is changed
nx affected:graph # Highlights projects which may have changed in behavior
```

## Run Many
```bash
nx run-many --target=build --projects=app1,app2
nx run-many --target=lint --all # Runs all projects that have a test target, use this sparingly.
```

# Gitpod
`https://gitpod.io/#https://github.com/Vittitow/gitpod-nx-tf`
