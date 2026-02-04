Add-Type -AssemblyName System.Drawing

function Get-BrandColors($path) {
    if (-not (Test-Path $path)) { return "File not found" }
    try {
        $img = [System.Drawing.Bitmap]::new($path)
        $counts = @{}
        
        # Scan pixels with step 4
        for ($x = 0; $x -lt $img.Width; $x += 4) {
            for ($y = 0; $y -lt $img.Height; $y += 4) {
                $p = $img.GetPixel($x, $y)
                
                # Filter out transparent, white, and very light gray, and very dark (black text)
                if ($p.A -gt 200 -and ($p.R -lt 240 -or $p.G -lt 240 -or $p.B -lt 240) -and ($p.R -gt 20 -or $p.G -gt 20 -or $p.B -gt 20)) {
                    # Round to nearest 10 to group similar shades
                    $r = [int]([Math]::Round($p.R / 10) * 10)
                    $g = [int]([Math]::Round($p.G / 10) * 10)
                    $b = [int]([Math]::Round($p.B / 10) * 10)
                    $key = "{0:X2}{1:X2}{2:X2}" -f $r, $g, $b
                    $counts[$key]++
                }
            }
        }
        
        $sorted = $counts.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 3
        $colors = $sorted | ForEach-Object { "#" + $_.Key }
        return $colors -join ", "
    }
    catch {
        return "Error: $_"
    }
}

Write-Output "Vimtra: $(Get-BrandColors 'logos\Vimtra Ventures.png')"
Write-Output "Urpan: $(Get-BrandColors 'logos\Urpan Technologies.png')"
Write-Output "Insight: $(Get-BrandColors 'logos\Insight Intelli.png')"
Write-Output "TechMynds: $(Get-BrandColors 'logos\Tech Mynds 1.png')"
