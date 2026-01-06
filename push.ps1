param(
  [string]$RepoUrl = "https://github.com/parsavat/arc-invoice-platform.git",
  [string]$Branch = "main",
  [string]$Message = "feat: initial push to arc-invoice-platform"
)
$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot
if (-not (Test-Path ".git")) { git init | Out-Null }
try { $current = git remote get-url origin 2>$null } catch { $current = $null }
if (-not $current) { git remote add origin $RepoUrl | Out-Null } elseif ($current -ne $RepoUrl) { git remote set-url origin $RepoUrl | Out-Null }
git config --global credential.helper manager | Out-Null
git branch -M $Branch | Out-Null
$status = git status --porcelain
if ($status) {
  if (-not $Message -or $Message.Trim().Length -eq 0) { $Message = "chore: sync $(Get-Date -Format 'yyyy-MM-ddTHH:mm:ss')" }
  git add -A
  git commit -m $Message
}
git push -u origin $Branch
