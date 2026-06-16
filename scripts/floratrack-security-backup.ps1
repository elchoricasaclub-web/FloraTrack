$ErrorActionPreference = "Stop"

$ProjectRoot = "\\wsl.localhost\Ubuntu\home\usergrowlifecol\gacp-growlifecol"

if (!(Test-Path $ProjectRoot)) {
  throw "No existe el proyecto en: $ProjectRoot"
}

$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupRoot = Join-Path $env:USERPROFILE "Desktop\FloraTrack_Backups"
$Stage = Join-Path $BackupRoot "FloraTrack_CODE_$Stamp"
$Zip = "$Stage.zip"
$ZipHash = "$Zip.sha256.txt"
$LatestPointer = Join-Path $BackupRoot "ULTIMO_BACKUP_FLORATRACK.txt"

New-Item -ItemType Directory -Force -Path $BackupRoot | Out-Null

$ExcludeDirs = @(
  "node_modules",
  ".next",
  ".git",
  "dist",
  "out",
  ".turbo",
  "coverage"
)

$ExcludeFiles = @(
  "*.log",
  ".env",
  ".env.local",
  ".env.development.local",
  ".env.production.local",
  ".env.test.local"
)

Write-Host ""
Write-Host "Creando backup seguro de FloraTrack..." -ForegroundColor Cyan
Write-Host "Proyecto: $ProjectRoot" -ForegroundColor Cyan
Write-Host "Destino: $Stage" -ForegroundColor Cyan
Write-Host ""

$RobocopyArgs = @(
  $ProjectRoot,
  $Stage,
  "/E",
  "/XJ",
  "/R:2",
  "/W:2",
  "/XD"
) + $ExcludeDirs + @(
  "/XF"
) + $ExcludeFiles

& robocopy @RobocopyArgs | Out-Host

$RobocopyCode = $LASTEXITCODE

if ($RobocopyCode -gt 7) {
  throw "Robocopy fallo con codigo $RobocopyCode"
}

$Manifest = Join-Path $Stage "BACKUP_MANIFEST_$Stamp.txt"
$Hashes = Join-Path $Stage "BACKUP_FILE_HASHES_$Stamp.txt"
$Readme = Join-Path $Stage "README_RESTORE_$Stamp.txt"

$Files = Get-ChildItem -Path $Stage -Recurse -File | Sort-Object FullName

@(
  "FloraTrack Security Backup",
  "Fecha: $(Get-Date -Format o)",
  "Proyecto: $ProjectRoot",
  "Backup folder: $Stage",
  "Zip: $Zip",
  "Archivos respaldados: $($Files.Count)",
  "",
  "Excluido por seguridad y rendimiento:",
  "- node_modules",
  "- .next",
  "- .git",
  "- dist / out / .turbo / coverage",
  "- .env*",
  "- archivos .log",
  "",
  "Restauracion:",
  "1. Extraer el ZIP en una carpeta nueva.",
  "2. Abrir VS Code en esa carpeta.",
  "3. Ejecutar npm install.",
  "4. Ejecutar npm run dev.",
  "5. Abrir http://localhost:3000.",
  "",
  "Nota:",
  "Los datos guardados dentro de la app viven en localStorage del navegador.",
  "Tambien debes exportar el backup de datos desde el navegador."
) | Set-Content -Path $Readme -Encoding UTF8

$Files | ForEach-Object {
  $Relative = $_.FullName.Substring($Stage.Length + 1)
  "$Relative`t$($_.Length)`t$($_.LastWriteTime.ToString('s'))"
} | Set-Content -Path $Manifest -Encoding UTF8

Get-ChildItem -Path $Stage -Recurse -File |
  Where-Object { $_.FullName -notmatch "BACKUP_FILE_HASHES_" } |
  Sort-Object FullName |
  ForEach-Object {
    $Relative = $_.FullName.Substring($Stage.Length + 1)
    $Hash = (Get-FileHash -Path $_.FullName -Algorithm SHA256).Hash
    "$Hash  $Relative"
  } | Set-Content -Path $Hashes -Encoding UTF8

if (Test-Path $Zip) {
  Remove-Item $Zip -Force
}

Compress-Archive -Path (Join-Path $Stage "*") -DestinationPath $Zip -CompressionLevel Optimal

$ZipInfo = Get-Item $Zip
$ZipHashValue = (Get-FileHash -Path $Zip -Algorithm SHA256).Hash

"SHA256  $ZipHashValue  $($ZipInfo.Name)" | Set-Content -Path $ZipHash -Encoding UTF8

@(
  "ULTIMO BACKUP FLORATRACK",
  "Fecha: $(Get-Date -Format o)",
  "Carpeta: $Stage",
  "ZIP: $Zip",
  "SHA256 ZIP: $ZipHashValue",
  "Tamano ZIP MB: $([Math]::Round($ZipInfo.Length / 1MB, 2))",
  "",
  "IMPORTANTE:",
  "Este backup cubre codigo fuente y configuracion del proyecto.",
  "No incluye node_modules ni .next porque se reconstruyen con npm install y npm run dev.",
  "No incluye archivos .env por seguridad.",
  "Los registros guardados en la app viven en localStorage del navegador.",
  "Exporta tambien los datos locales desde el navegador."
) | Set-Content -Path $LatestPointer -Encoding UTF8

Write-Host ""
Write-Host "BACKUP DE CODIGO COMPLETADO CORRECTAMENTE" -ForegroundColor Green
Write-Host "ZIP: $Zip" -ForegroundColor Green
Write-Host "SHA256: $ZipHashValue" -ForegroundColor Yellow
Write-Host "Resumen: $LatestPointer" -ForegroundColor Cyan
Write-Host ""
