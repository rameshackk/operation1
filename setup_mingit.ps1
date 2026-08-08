$zipUrl = "https://github.com/git-for-windows/git/releases/download/v2.45.2.windows.1/MinGit-2.45.2-64-bit.zip"
$outZip = "C:\Users\ADMIN\AppData\Local\Temp\mingit.zip"
$targetDir = "C:\Users\ADMIN\mingit"

Write-Host "Downloading MinGit portable..."
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-WebRequest -Uri $zipUrl -OutFile $outZip -UseBasicParsing

Write-Host "Extracting MinGit..."
if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}
Expand-Archive -Path $outZip -DestinationPath $targetDir -Force

Write-Host "MinGit extracted. Checking git version..."
$gitExe = Join-Path $targetDir "cmd\git.exe"
& $gitExe --version

# Add to User PATH
$userPath = [Environment]::GetEnvironmentVariable("PATH", "User")
$gitCmdDir = Join-Path $targetDir "cmd"
if (-not $userPath.Contains($gitCmdDir)) {
    [Environment]::SetEnvironmentVariable("PATH", "$userPath;$gitCmdDir", "User")
    Write-Host "Added MinGit to User PATH"
}
