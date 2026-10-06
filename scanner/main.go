package main

import (
	"fmt"
	"os"
	"os/exec"
	"runtime"
	"strings"
)

func ps(q string) string {
	out, err := exec.Command("powershell.exe", "-NoProfile", "-Command", q).Output()
	if err != nil { return "" }
	return strings.TrimSpace(string(out))
}

func main() {
	if runtime.GOOS != "windows" { fmt.Println("PCForge Scanner supports Windows 10/11 only."); os.Exit(1) }
	cpu := ps("(Get-CimInstance Win32_Processor | Select-Object -First 1 -ExpandProperty Name)")
	gpu := ps("(Get-CimInstance Win32_VideoController | Select-Object -First 1 -ExpandProperty Name)")
	ram := ps("[math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB)")
	osName := ps("(Get-CimInstance Win32_OperatingSystem).Caption + ' ' + (Get-CimInstance Win32_OperatingSystem).OSArchitecture")
	res := ps("(Get-CimInstance Win32_VideoController | Where-Object {$_.CurrentHorizontalResolution -and $_.CurrentVerticalResolution} | Select-Object -First 1 | ForEach-Object { $_.CurrentHorizontalResolution.ToString() + 'x' + $_.CurrentVerticalResolution.ToString() })")
	free := ps("[math]::Round((Get-PSDrive -Name C).Free / 1GB)")
	fmt.Printf("{\n  \"id\": \"local\",\n  \"cpu\": %q,\n  \"gpu\": %q,\n  \"ram\": %s,\n  \"os\": %q,\n  \"resolution\": %q,\n  \"storage_free_gb\": %s\n}\n", cpu, gpu, ram, osName, res, free)
}
