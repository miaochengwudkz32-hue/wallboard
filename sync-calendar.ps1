# Wallboard ICS sync — downloads the calendar feed into the wallpaper folder.
# Scheduled via Task Scheduler; also runnable by hand.
param(
    [Parameter(Mandatory = $true)][string]$ConfigPath,
    [Parameter(Mandatory = $true)][string]$OutFile
)
$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$cfg = Get-Content $ConfigPath -Raw -Encoding UTF8 | ConvertFrom-Json
$url = $cfg.icsUrl
if (-not $url) { Write-Output "no icsUrl configured"; exit 0 }
if ($url -like "webcal://*") { $url = $url -replace "^webcal://", "https://" }

$proxy = $null
if ($env:HTTPS_PROXY) { $proxy = $env:HTTPS_PROXY }

if ($proxy) {
    Invoke-WebRequest -Uri $url -OutFile $OutFile -UseBasicParsing -TimeoutSec 30 -Proxy $proxy
} else {
    Invoke-WebRequest -Uri $url -OutFile $OutFile -UseBasicParsing -TimeoutSec 30
}
Write-Output "synced calendar -> $OutFile"
