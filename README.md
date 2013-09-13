# Headless VM #

Running VirtualBox VM headless(ly). ***For Windows only.***

## Usage ##

If the name of your VM is called **MyVm** and you want to run it headless.

**To start the VM**

    headless start MyVm

**to stop (really suspend) the VM**

    headless stop MyVm

**List all VMs**

    headless list

**Show Status of a VM**

    headless status MyVm

## Install ##
Copy `dist\headless.exe` into your %PATH%.

Optionally you can create a shortcut to run and stop on your desktop.


## Want to add more features? ##

1. Pull down the code `git clone https://github.com/hyperlink/headless-vm.git`
2. Modify the code in `headless.js`
3. Run `compile.cmd` to create the `headless.exe`

## License MIT ##