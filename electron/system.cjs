const { execFile } = require("child_process");

function runPowerShell(script) {
  return new Promise((resolve, reject) => {
    execFile(
      "powershell.exe",
      ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", script],
      { windowsHide: true, maxBuffer: 4 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) reject(new Error(stderr.trim() || error.message));
        else resolve(stdout.trim());
      }
    );
  });
}

async function scanSystem() {
  if (process.platform !== "win32") {
    throw new Error("PCForge hardware scanning currently supports Windows only.");
  }

  const ps = [
    "$ErrorActionPreference = 'Stop'",
    "$cpu = Get-CimInstance Win32_Processor | Select-Object -First 1 Name,Manufacturer,NumberOfCores,NumberOfLogicalProcessors,MaxClockSpeed,CurrentClockSpeed",
    "$gpu = @(Get-CimInstance Win32_VideoController | Select-Object Name,AdapterRAM,DriverVersion,DriverDate,VideoProcessor)",
    "$ram = @(Get-CimInstance Win32_PhysicalMemory | Select-Object Capacity,Speed,Manufacturer,PartNumber,DeviceLocator,SMBIOSMemoryType)",
    "$computer = Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer,Model,TotalPhysicalMemory",
    "$os = Get-CimInstance Win32_OperatingSystem | Select-Object Caption,Version,BuildNumber,OSArchitecture",
    "$disks = @(Get-CimInstance Win32_LogicalDisk -Filter \"DriveType=3\" | Select-Object DeviceID,VolumeName,Size,FreeSpace)",
    "$modes = @(Get-CimInstance Win32_VideoController | Select-Object Name,CurrentHorizontalResolution,CurrentVerticalResolution,CurrentRefreshRate)",
    "$secureBoot = $null; try { $secureBoot = [bool](Confirm-SecureBootUEFI) } catch {}",
    "$tpm = $null; try { $t = Get-Tpm; $tpm = [PSCustomObject]@{ Present=$t.TpmPresent; Ready=$t.TpmReady; Version=$t.ManufacturerVersion } } catch {}",
    "[PSCustomObject]@{ cpu=$cpu; gpu=$gpu; ram=$ram; computer=$computer; os=$os; disks=$disks; modes=$modes; secureBoot=$secureBoot; tpm=$tpm } | ConvertTo-Json -Depth 5 -Compress"
  ].join("; ");

  const data = JSON.parse(await runPowerShell(ps));
  const one = (v) => Array.isArray(v) ? v : (v ? [v] : []);
  const n = (v) => Number.isFinite(Number(v)) ? Number(v) : null;
  const gb = (v) => Math.round((n(v) || 0) / 1073741824 * 10) / 10;
  const ram = one(data.ram);
  const gpu = one(data.gpu);
  const disks = one(data.disks);
  const modes = one(data.modes);

  return {
    scannedAt: new Date().toISOString(),
    cpu: {
      name: data.cpu?.Name || "Unknown CPU",
      manufacturer: data.cpu?.Manufacturer || null,
      cores: n(data.cpu?.NumberOfCores),
      threads: n(data.cpu?.NumberOfLogicalProcessors),
      currentMHz: n(data.cpu?.CurrentClockSpeed),
      maxMHz: n(data.cpu?.MaxClockSpeed)
    },
    gpus: gpu.map(g => ({
      name: g.Name || "Unknown GPU",
      adapterRamBytes: n(g.AdapterRAM),
      driverVersion: g.DriverVersion || null,
      driverDate: g.DriverDate || null,
      videoProcessor: g.VideoProcessor || null
    })),
    memory: {
      totalBytes: n(data.computer?.TotalPhysicalMemory),
      totalGB: gb(data.computer?.TotalPhysicalMemory),
      modules: ram.map(m => ({
        capacityBytes: n(m.Capacity),
        capacityGB: gb(m.Capacity),
        speedMHz: n(m.Speed),
        manufacturer: m.Manufacturer || null,
        partNumber: m.PartNumber || null,
        slot: m.DeviceLocator || null,
        smbiosType: n(m.SMBIOSMemoryType)
      }))
    },
    motherboard: {
      manufacturer: data.computer?.Manufacturer || null,
      model: data.computer?.Model || null
    },
    os: {
      name: data.os?.Caption || null,
      version: data.os?.Version || null,
      build: data.os?.BuildNumber || null,
      architecture: data.os?.OSArchitecture || null
    },
    storage: disks.map(d => ({
      drive: d.DeviceID || null,
      label: d.VolumeName || null,
      totalGB: gb(d.Size),
      freeGB: gb(d.FreeSpace)
    })),
    display: {
      modes: modes.map(m => ({
        gpu: m.Name || null,
        width: n(m.CurrentHorizontalResolution),
        height: n(m.CurrentVerticalResolution),
        refreshRate: n(m.CurrentRefreshRate)
      }))
    },
    security: {
      secureBoot: data.secureBoot,
      tpm: data.tpm || null
    }
  };
}

module.exports = { scanSystem };
