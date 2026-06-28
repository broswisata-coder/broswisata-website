param(
  [string]$HostName = "broswisata.id",
  [string]$Key = "8cc00956eeb14bfb9a0494c1e0dc6b00",
  [string]$KeyLocation = "https://broswisata.id/8cc00956eeb14bfb9a0494c1e0dc6b00.txt",
  [string]$SitemapPath = ".\sitemap.xml"
)

$sitemapFile = Resolve-Path -LiteralPath $SitemapPath
[xml]$sitemap = Get-Content -Raw -LiteralPath $sitemapFile

$namespaceManager = New-Object System.Xml.XmlNamespaceManager($sitemap.NameTable)
$namespaceManager.AddNamespace("sm", "http://www.sitemaps.org/schemas/sitemap/0.9")

$urls = $sitemap.SelectNodes("//sm:url/sm:loc", $namespaceManager) |
  ForEach-Object { $_.InnerText.Trim() } |
  Where-Object { $_ }

if (-not $urls -or $urls.Count -eq 0) {
  throw "No URLs found in sitemap: $sitemapFile"
}

$payload = @{
  host = $HostName
  key = $Key
  keyLocation = $KeyLocation
  urlList = @($urls)
} | ConvertTo-Json -Depth 3

Invoke-RestMethod `
  -Method Post `
  -Uri "https://api.indexnow.org/indexnow" `
  -ContentType "application/json; charset=utf-8" `
  -Body $payload

Write-Host "Submitted $($urls.Count) URLs to IndexNow for $HostName"
