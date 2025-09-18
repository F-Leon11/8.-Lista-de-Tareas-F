# build.ps1 - Script de construcción para Windows PowerShell
Write-Host "Construyendo proyecto para GitHub Pages..." -ForegroundColor Green

# Crear carpeta dist si no existe
if (!(Test-Path "dist")) {
    New-Item -ItemType Directory -Path "dist" | Out-Null
    Write-Host "Carpeta 'dist' creada" -ForegroundColor Yellow
}

# Copiar archivos HTML
Write-Host "Copiando archivos HTML..." -ForegroundColor Cyan
Copy-Item "*.html" -Destination "dist\" -Force

# Copiar carpetas CSS, JS y assets si existen
$folders = @("css", "js", "assets", "Fuentes")
foreach ($folder in $folders) {
    if (Test-Path $folder) {
        Write-Host "Copiando carpeta $folder..." -ForegroundColor Cyan
        Copy-Item $folder -Destination "dist\" -Recurse -Force
    } else {
        Write-Host "Carpeta $folder no encontrada, omitiendo..." -ForegroundColor Yellow
    }
}

Write-Host "¡Build completado! Archivos copiados a /dist" -ForegroundColor Green
Write-Host "Estructura de archivos:" -ForegroundColor Magenta
Get-ChildItem -Path "dist" -Recurse | ForEach-Object {
    Write-Host "  $($_.FullName.Replace((Get-Location).Path + '\', ''))" -ForegroundColor White
}