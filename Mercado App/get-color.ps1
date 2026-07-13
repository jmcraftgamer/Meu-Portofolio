Add-Type -AssemblyName System.Drawing
$imgPath = "C:\Users\eojap\Projetos\Portofolho\Mercado App\web\public\images\banner_personalizado.png"
$img = [System.Drawing.Image]::FromFile($imgPath)
$bmp = New-Object System.Drawing.Bitmap $img

$rSum = 0; $gSum = 0; $bSum = 0; $count = 0
$step = 5

for ($x = 0; $x -lt $bmp.Width; $x += $step) {
  for ($y = 0; $y -lt $bmp.Height; $y += $step) {
    $px = $bmp.GetPixel($x, $y)
    if ($px.R -gt $px.B -and $px.R -gt $px.G -and $px.R -gt 100) {
      $rSum += $px.R
      $gSum += $px.G
      $bSum += $px.B
      $count++
    }
  }
}

$bmp.Dispose()
$img.Dispose()

if ($count -gt 0) {
  $r = [Math]::Min(255, [int]($rSum / $count))
  $g = [Math]::Min(255, [int]($gSum / $count))
  $b = [Math]::Min(255, [int]($bSum / $count))
  Write-Host ("#" + $r.ToString("X2") + $g.ToString("X2") + $b.ToString("X2"))
} else {
  Write-Host "#e53935"
}
