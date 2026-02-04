Add-Type -AssemblyName System.Drawing

function Get-Color($path) {
    if (-not (Test-Path $path)) { return "File not found: $path" }
    try {
        $img = [System.Drawing.Bitmap]::new($path)
        $counts = @{}
        for ($x = 0; $x -lt $img.Width; $x += 5) {
            for ($y = 0; $y -lt $img.Height; $y += 5) {
                $p = $img.GetPixel($x, $y)
                if ($p.A -gt 200 -and ($p.R -lt 250 -or $p.G -lt 250 -or $p.B -lt 250)) {
                    # Simple bucketing
                    $key = "{0:X2}{1:X2}{2:X2}" -f $p.R, $p.G, $p.B
                    $counts[$key]++
                }
            }
        }
        $top = $counts.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 5
        return $top | ForEach-Object { "#" + $_.Key + " (" + $_.Value + ")" }
    }
    catch { return "Error: $_" }
}

Write-Output "INSIGHT: $(Get-Color 'logos\Insight Intelli.png')"
Write-Output "TECHMYNDS: $(Get-Color 'logos\Tech Mynds 1.png')"
