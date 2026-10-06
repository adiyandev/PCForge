package main

import (
	"encoding/json"
	"fmt"
	"net/url"
	"os/exec"
	"runtime"
	"strconv"
	"strings"
)

type ScanResult struct {
	ID            string `json:"id"`
	CPU           string `json:"cpu"`
	GPU           string `json:"gpu"`
	RAM           int    `json:"ram"`
	OS            string `json:"os"`
	Resolution    string `json:"resolution"`
	StorageFreeGB int    `json:"storage_free_gb"`
}

func ps(q string) string {
	out, err := exec.Command("powershell.exe", "-NoProfile", "-Command", q).Output()
	if err != nil {
		return ""
	}
	return strings.TrimSpace(string(out))
}

func intValue(value string) int {
	n, err := strconv.Atoi(strings.TrimSpace(value))
	if err != nil {
		return 0
	}
	return n
}

func openBrowser(target string) {
	_ = exec.Command("cmd", "/c", "start", "", target).Start()
}

func main() {
	if runtime.GOOS != "windows" {
		fmt.Println("PCForge Scanner supports Windows 10/11 only.")
		return
	}

	cpu := ps("(Get-CimInstance Win32_Processor | Select-Object -First 1 -ExpandProperty Name)")
	gpu := ps("(Get-CimInstance Win32_VideoController | Select-Object -First 1 -ExpandProperty Name)")
	ram := intValue(ps("[math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB)"))
	osName := ps("(Get-CimInstance Win32_OperatingSystem).Caption + ' ' + (Get-CimInstance Win32_OperatingSystem).OSArchitecture")
	res := ps("(Get-CimInstance Win32_VideoController | Where-Object {$_.CurrentHorizontalResolution -and $_.CurrentVerticalResolution} | Select-Object -First 1 | ForEach-Object { $_.CurrentHorizontalResolution.ToString() + 'x' + $_.CurrentVerticalResolution.ToString() })")
	free := intValue(ps("[math]::Round((Get-PSDrive -Name C).Free / 1GB)"))

	scan := ScanResult{
		ID:            "local",
		CPU:           cpu,
		GPU:           gpu,
		RAM:           ram,
		OS:            osName,
		Resolution:    res,
		StorageFreeGB: free,
	}

	data, err := json.Marshal(scan)
	if err != nil {
		fmt.Println("PCForge could not create the scan result:", err)
		fmt.Println("Press Enter to close.")
		fmt.Scanln()
		return
	}

	fmt.Println("PCForge Scanner")
	fmt.Println("================")
	fmt.Println("CPU:     ", cpu)
	fmt.Println("GPU:     ", gpu)
	fmt.Println("RAM:     ", ram, "GB")
	fmt.Println("OS:      ", osName)
	fmt.Println("Display: ", res)
	fmt.Println("Free C:: ", free, "GB")
	fmt.Println()
	fmt.Println("Opening PCForge with your hardware...")
	fmt.Println()

	target := "https://adiyandev.github.io/PCForge/my-pc?scan=" + url.QueryEscape(string(data))
	openBrowser(target)

	fmt.Println("Your browser should now show the detected hardware.")
	fmt.Println("Press Enter to close this scanner.")
	fmt.Scanln()
}
