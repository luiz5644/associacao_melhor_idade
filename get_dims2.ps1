[System.Reflection.Assembly]::LoadWithPartialName('System.Drawing')
$i1=[System.Drawing.Image]::FromFile('public/imagens/fotoinicio2.png')
Write-Host ("fotoinicio2.png: {0}x{1}px" -f $i1.Width, $i1.Height)
$i1.Dispose()