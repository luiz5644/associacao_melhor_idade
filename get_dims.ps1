[System.Reflection.Assembly]::LoadWithPartialName('System.Drawing')
$i=[System.Drawing.Image]::FromFile('public/imagens/fotoinicio2.png')
Write-Host ("fotoinicio2.png: {0}x{1}px" -f $i.Width, $i.Height)
$i.Dispose()