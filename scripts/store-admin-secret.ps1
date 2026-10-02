param([Parameter(Mandatory=$true)][string]$Destination)
$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$target = [IO.Path]::GetFullPath((Join-Path $root $Destination))
if (-not $target.StartsWith($root + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Destino fora do projeto.' }
if (Test-Path -LiteralPath $target) { throw 'O arquivo protegido ja existe. Preserve-o antes de uma rotacao.' }
[Console]::InputEncoding = [Text.UTF8Encoding]::new($false)
$plain = [Console]::In.ReadToEnd()
if (-not $plain) { throw 'Conteudo vazio.' }
if ($PSEdition -eq 'Core') { [Reflection.Assembly]::Load('System.Security.Cryptography.ProtectedData') | Out-Null }
else { [Reflection.Assembly]::Load('System.Security, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a') | Out-Null }
$entropy = [Text.Encoding]::UTF8.GetBytes('SertaoMaker-LocalSecrets-v1')
$protected = [Security.Cryptography.ProtectedData]::Protect([Text.Encoding]::UTF8.GetBytes($plain), $entropy, [Security.Cryptography.DataProtectionScope]::CurrentUser)
$verified = [Text.Encoding]::UTF8.GetString([Security.Cryptography.ProtectedData]::Unprotect($protected, $entropy, [Security.Cryptography.DataProtectionScope]::CurrentUser))
if ($verified -cne $plain) { throw 'Falha ao verificar a criptografia.' }
$encrypted = 'DPAPIv1:' + [Convert]::ToBase64String($protected)
[IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($target)) | Out-Null
[IO.File]::WriteAllText($target, $encrypted, [Text.UTF8Encoding]::new($false))
