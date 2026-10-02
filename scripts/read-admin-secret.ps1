param([string]$Path = 'work/acesso-painel.protegido.txt')
$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$target = [IO.Path]::GetFullPath((Join-Path $root $Path))
if (-not $target.StartsWith($root + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Arquivo fora do projeto.' }
$encrypted = [IO.File]::ReadAllText($target).Trim()
if (-not $encrypted.StartsWith('DPAPIv1:')) { throw 'Formato de arquivo protegido invalido.' }
if ($PSEdition -eq 'Core') { [Reflection.Assembly]::Load('System.Security.Cryptography.ProtectedData') | Out-Null }
else { [Reflection.Assembly]::Load('System.Security, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a') | Out-Null }
$entropy = [Text.Encoding]::UTF8.GetBytes('SertaoMaker-LocalSecrets-v1')
$plain = [Text.Encoding]::UTF8.GetString([Security.Cryptography.ProtectedData]::Unprotect([Convert]::FromBase64String($encrypted.Substring(8)), $entropy, [Security.Cryptography.DataProtectionScope]::CurrentUser))
# Run intentionally in your own terminal; never paste the result into chat or Git.
[Console]::OutputEncoding = [Text.UTF8Encoding]::new($false)
[Console]::Write($plain)
