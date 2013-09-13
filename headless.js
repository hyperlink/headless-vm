import System
import System.IO

var args       = Environment.GetCommandLineArgs()
var myFilename = args[0].substring(args[0].lastIndexOf('\\')+1)

if (args.length < 2) {
	displayHelp(myFilename)
	Environment.Exit(1)
}

var vboxPath : String = Environment.GetEnvironmentVariable("VBOX_INSTALL_PATH")
if (!vboxPath) {
	print("VirtualBox is not installed?")
	Environment.Exit(1)
}

var command  = args[1]
var vm       = args.length == 3 ? args[2] : ''
var WshShell = new ActiveXObject("WScript.Shell")
var exec     = WshShell.Exec(vboxPath +"vboxmanage list vms")
var vms      = parseVms(exec.StdOut.ReadAll())

var commands = {
	start: function() {
		checkValidVM()
		WshShell.Run(createCommand('vboxheadless') +" -s "+ vm, 0)
	},

	stop: function() {
		checkValidVM()
		WshShell.Run(createCommand('VBoxManage') +" controlvm "+ vm +" savestate", 0)
	},

	status: function() {
		checkValidVM()
		print('VM '+ vm +' is '+ isRunning(vm))
	},

	list: function() {
		print()
		for(var validVm in vms) {
			validVm != 'length' && print(validVm)
		}
	}
}

if (command in commands) {
	commands[command]()
} else {
	print('Unknown command '+ command)
}

function checkValidVM() {
	if (!vm) {
		print('  <VM> is required for this command.')
		displayHelp(myFilename)
		Environment.Exit(1)
	}

	if (!vms[vm]) {
		print(vm +  " is not a valid VirtualBox VM")
		Environment.Exit(1)
	}
}

function isRunning(vm : String) : String {
	var exec       = WshShell.Exec(vboxPath +"vboxmanage list runningvms")
	var runningVms = parseVms(exec.StdOut.ReadAll())
	return runningVms[vm] ? 'running' : 'not running'
}

function displayHelp(file) {
	print()
	print('  Usage: '+ file +' <command>')
	print()
	print('  Commands:')
	print()
	print('    start <VM>    Start or Resume the <VM>')
	print('    stop <VM>     Suspend the <VM>')
	print('    status <VM>   Show VM state')
	print('    list          Lists your Virtual Box VMs')
}

function createCommand(cmd) {
	return ['"', vboxPath, cmd, '"'].join('')
}

function parseVms(str) {
	var vms         = str.match(/^"(.+)"/gm)
	var quoteRegExp = /"/g
	if (vms && vms.length) {
		var ret = {
			length: vms.length
		}
		for (var i = vms.length - 1; i >= 0; i--) {
			ret[vms[i].replace(quoteRegExp, '')] = true
		}
		return ret
	}
	return {}
}