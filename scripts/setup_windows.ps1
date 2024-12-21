# Requer privilégios de administrador
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Warning "Execute este script como Administrador!"
    Break
}

# Instala o Chocolatey se não estiver instalado
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Output "Instalando Chocolatey..."
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
}

# Instala o Docker Desktop
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Output "Instalando Docker Desktop..."
    choco install docker-desktop -y
}

# Instala o Python
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Output "Instalando Python..."
    choco install python -y
    refreshenv
}

# Instala o Git se não estiver instalado
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Output "Instalando Git..."
    choco install git -y
}

# Instala o Node.js se não estiver instalado
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Output "Instalando Node.js..."
    choco install nodejs-lts -y
}

# Instala o Visual Studio Code se não estiver instalado
if (!(Get-Command code -ErrorAction SilentlyContinue)) {
    Write-Output "Instalando Visual Studio Code..."
    choco install vscode -y
}

# Habilita o WSL 2
Write-Output "Habilitando WSL 2..."
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Baixa e instala o kernel do WSL 2
Write-Output "Instalando o kernel do WSL 2..."
$wslUrl = "https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi"
$wslInstaller = "$env:TEMP\wsl_update_x64.msi"
Invoke-WebRequest -Uri $wslUrl -OutFile $wslInstaller
Start-Process msiexec.exe -Wait -ArgumentList "/I $wslInstaller /quiet"
Remove-Item $wslInstaller

# Define WSL 2 como padrão
wsl --set-default-version 2

# Instala o Ubuntu no WSL
Write-Output "Instalando Ubuntu no WSL..."
wsl --install -d Ubuntu

# Instala as extensões do VS Code
Write-Output "Instalando extensões do VS Code..."
code --install-extension ms-python.python
code --install-extension ms-azuretools.vscode-docker
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode-remote.remote-wsl

# Atualiza as variáveis de ambiente
refreshenv

Write-Output "Instalação concluída! Por favor, reinicie o computador para finalizar a configuração do WSL 2."
Write-Output "Após reiniciar, execute o Docker Desktop e certifique-se de que o WSL 2 está configurado corretamente." 