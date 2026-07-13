$apiJob = Start-Job -Name "CentralAPI" -ScriptBlock {
  Set-Location "C:\Users\eojap\Projetos\Portofolho\Mercado App\server"
  npx tsx src/index.ts
}
$webJob = Start-Job -Name "CentralWeb" -ScriptBlock {
  Set-Location "C:\Users\eojap\Projetos\Portofolho\Mercado App\web"
  npx vite --host
}
Write-Output "Servidores iniciados: API (Job $($apiJob.Id)), Web (Job $($webJob.Id))"
