---
title: "Show Me the Receipts: Physical Receipts for Digital Payments"
date: 2026-8-11
categories:
layout: custom-blog-post
show_date: true
---

After some time off to rest and reset, I came back to work with a lot of exciting projects to dig into. On the top of that list was a WAAS Demo using Fordefi. This seemed to be the right place to start, given my last project allowed me the chance to research and experiment with key custodians, so getting the chance to see how another custodian works felt like a great place to begin. 

A twist!  While getting the demo running, I received a seemingly unrelated surprise in the mail: a thermal printer.

A thermal printer is a printer that uses heat to print on special heat-sensitive paper, and is commonly used for receipts. 

*It wasn't really a surprise, I had ordered it for myself on a whim with the hopes of using it for art projects. I learned about the versatility of thermal printers after seeing a classmate use one in grad school for a project years ago, and I finally had the space in my brain to order one to play with it. It was a surprise however, how much enjoyment I got out of this silly thing.*


After printing a few things from an app on my phone, I quickly wanted to get that thing hooked up to the terminal, and learned that there was a python library for doing just that: [python-escpos](https://github.com/python-escpos/python-escpos)! And what a coincidence that the Fordefi Demo backend was also written in Python - the idea kind of wrote itself. Print out physical, old-school receipts for a digital transaction.


<div style="display: flex; justify-content:center; align-items: center; gap: 15px;">
  <img src="/assets/blog-post-assets/2026-08-11/IMG_4246.png" alt="images printed with iOS app" width="40%"/>
  <img src="/assets/blog-post-assets/2026-08-11/IMG_4253.png" alt="image printed with iOS app" width="40%"/>
</div>

## The Tech / What it is

### Connecting the printer & a rabbit hole

The basic example in the `python-escpos` README shows how to connect to a printer via the USB interface. What is the difference between connecting with USB and the Serial class? This was an interesting rabbit hole that I took a tour through with my guide, Claude.

In summary, interacting with a computer "back in the day" (i.e. in the 60s and 70s) was always done via a wired serial connection called tty (teletypewriter). Serial in this instance just means that information is sent to and from the computer and the connected device one bit at a time, over a wire, in series, as opposed to in parallel. Over the years, this became the standard abstraction for sending and receiving information from a device and was built into the Unix OS.

USB came onto the scene in the 90s, which is also a form of serial communication, just done with a more sophisticated protocol and faster transfer speeds. It included a class called CDC (Communications Device Class), which would allow for devices to declare themselves as different subtypes related to different communication behaviors or protocols. In this case, the CDC class would tell operating systems to treat the connected device as a standard serial/tty device, and relay it to those drivers under the hood. This is done in modern computers by creating a virtual serial port rather than requiring a new driver. This allowed for companies to reuse existing software drivers, and device firmware.


Modern devices, like my printer, often forgo the CDC class and specifically wrap the connection in a standard printer class. This allows for the whole thing to be very plug-and-playable because it means that when the printer is plugged in, the OS is already aware that this is a printer, and knows which drivers to provide for the device. 


Armed with this information, one could deduce that my printer was in fact using the printer USB class by using `system_profiler` with the USB datatype: `system_profiler SPUSBDataType` to look at my USB ports and find that my printer is connected. 

```bash
> system_profiler SPUSBDataType

USB:

    USB 3.1 Bus:

      Host Controller Driver: AppleT8132USBXHCI

        USB2.0 Hub:

          Product ID: 0x2815
          Vendor ID: 0x2109  (VIA Labs, Inc.)
          Version: 7.01
          Speed: Up to 480 Mb/s
          Manufacturer: VIA Labs, Inc.
          Location ID: 0x00100000 / 1
          Current Available (mA): 500
          Current Required (mA): 0
          Extra Operating Current (mA): 0

            USB Portable Printer:

              Product ID: 0x5011
              Vendor ID: 0x0416  (Winbond Electronics Corp.)
              Version: 2.00
              Serial Number: B120300001
              Speed: Up to 12 Mb/s
              Manufacturer: YICHIP3121
              Location ID: 0x00110000 / 5
              Current Available (mA): 500
              Current Required (mA): 400
              Extra Operating Current (mA): 0
```

The printer is connected as a "USB Portable Printer", and with the metadata included under that header, I could initialize the connection in the Python library with the product and vendor ids like this:

```py
from escpos.printer import Usb

printer = Usb(0x0416, 0x5011)  # vendor and product IDs
```

And then to print some text, I just used the `text()` method. I included some middleware in the API so I could capture the request and response information, and then printed it like this:

```py
def print_req(client_ip: str, method: str, path: str, status: int, duration: float):
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()) 

    log_line = f"[{timestamp}] {client_ip} -> {method} {path} | Status: {status} | Took: {duration:.4f}s"
    
    p.text(log_line)
    p.close()

```

<img src="/assets/blog-post-assets/2026-08-11/IMG_4324.png" alt="printing logs" width="50%"/>

Which, in hindsight is kind of boring! This is just a paper copy of my logs, not an actual receipt. The way our demo is structured, with the transaction creation and submission being handled in the client, I decided to go to the TS code to print out the transactions themselves. 

Finding an existing, and well-maintained library for interacting directly with an esc/pos printer in js in a similar way as I had done with Python proved more difficult than I expected. So, I ended up building on top of a generic library that allows for interacting with USB devices in general.
Since this library is more generic than the python one, it requires a few more steps to go through before printing, such as finding the printer device, opening it, choosing a configuration and claiming the interface. 

```ts
import { usb } from 'usb';

async function getPrinterDevice(vendorId: number, productId: number): Promise<UsbDevice | undefined> {
  const device = await usb.findDeviceByIds(vendorId, productId);
  if (!device) {
    console.error("printer not found, skipping receipt");
    return;
  }
  await device.open();
  await device.selectConfiguration(1);
  await device.claimInterface(0);

  return device
}

```
Finding the device, and opening it feel pretty straightforward. This is how the python library worked as well - searching for the device via the vendor and product ids. The `claimInterface` step also seems to make sense to me, I am just blocking the interface for the program, and will release it when I'm done.

`selectConfiguration` still feels a bit hand-wavey to me, but from my understanding, this is here to conform to the USB protocol, and is not as interesting for simple printers like this as it only has one set of configurations, and they can either be turned on and useable, or turned off. For other, more complex USB devices however, this can allow for the device to have different configurations if it can do multiple functions, and may need to change the power the device uses per functionality for example. :hand wave:

But, for my simple printer, I can choose configuration 1, and move on.

### The Receipt

Once I got the device connected, I needed to figure out what I wanted to print. I started with some of the basics that were easy to grab from the Fordefi response: transaction hash, Fordefi vault id, transaction request status. I put the details into a series of strings, broken by a newline. Then it was a matter of encoding these lines, and pushing them into a byte array that began with an initialization code, and ended with a cut code.* This byte array is passed to `device.transferOut` and it is printed!

```ts
  let receiptLines = [
    `fordefi-waas demo`,
    `TEST`,
    `tx: ${transactionId}`,
    `vault: ${vaultId}`,
    `status: ${status}`,
  ]
  const bytes: number[] = [];
  bytes.push(0x1b, 0x40); // initialize printer
  for (const line of receiptLines) {
    bytes.push(...new TextEncoder().encode(line + "\n")); 
  }
  bytes.push(...new TextEncoder().encode(new Date().toISOString() + "\n"));
  bytes.push(...new TextEncoder().encode("\n\n"));
  bytes.push(0x1d, 0x56, 0x00); // full cut

  await device.transferOut(1, bytes);

  await device.close();
```

Honestly, I'm not sure I needed the cut code. My printer does not have cutting ability, and so maybe I could have just left this off. 

<img src="/assets/blog-post-assets/2026-08-11/IMG_4332-edited.png" alt="early receipt prototype" width="50%"/>

Though this could be helpful information to have, it doesn't tell the whole transaction story, and is pretty specific to Fordefi. I wanted to make a receipt format that is a bit more versatile, and could include the transaction operations details and the fee. So, I ended up coming to a format that required a more sophisticated data structure, capable of handling different fields per line:

```ts
  export interface ReceiptLine {
    title: string;
    text: string;
    center?: boolean;
  }
  function buildReceipt(tx, formattedOps) {
    return [
      {title: "Network", text: `Stellar Testnet`},
      {title: "Source Account", text: `${tx.source_account}`},
      {title: "Operation(s)", text: `\n\t${formattedOps}`},
      {title: "Fee", text: `${tx.fee_charged as number/10_000_000} XLM`},
      {title: "Transaction Hash", text: txHash},
      {title: "Created At", text: tx.created_at},
    ]
  }
```

And played with formatting the receipt by centering the title, and bolding the title of each line. To do this, I needed to push a special series of bytes to tell the printer that everything after that should be center aligned for example. 

```ts
const ESC = 0x1b, GS = 0x1d;
const INIT = [ESC, 0x40];
const ALIGN_LEFT   = [ESC, 0x61, 0];
const ALIGN_CENTER = [ESC, 0x61, 1];
const BOLD_ON  = [ESC, 0x45, 1];
const BOLD_OFF = [ESC, 0x45, 0];
const CUT = [GS, 0x56, 0];


async function buildReceipt(lines: ReceiptLine[]): Promise<Uint8Array<ArrayBufferLike>> {
  const bytes: number[] = [...INIT];

  // add a header
  bytes.push(...ALIGN_CENTER);
  bytes.push(...new TextEncoder().encode("Fordefi WAAS Demo\n\n"));

  bytes.push(...ALIGN_LEFT);
  // add receipt contents
  for (const line of lines) {
    bytes.push(...BOLD_ON);
    bytes.push(...new TextEncoder().encode(line.title + ": "));
    bytes.push(...BOLD_OFF);
    bytes.push(...new TextEncoder().encode(line.text + "\n\n"));
  }

  // add a footer
  bytes.push(...ALIGN_CENTER);
  bytes.push(...new TextEncoder().encode("--The Aha Company--"));
  bytes.push(...new TextEncoder().encode("\n------------------------------\n"));
  bytes.push(...ALIGN_LEFT);

  bytes.push(...CUT);
  return new Uint8Array(bytes);
}

```

The bolding didn't really make much of a difference in the outcome to be honest, but this could be due to the fact that my printer is very basic, and perhaps a better quality printer would work better. 


The next step before I decided to call this spike done, was to add the Aha Company's logo at the bottom. To do that, I needed another js library called `sharp` to decode the image, resize it, turn it into grayscale and be left with a flat array of raw pixel information. Then, I needed to pack these pixel bytes again in a way that works for the printer. Honestly this is a blind spot for me in this code, and I need to research it a bit more to understand how it's working on a deeper level. 


```ts
async function loadImage(path: string, targetWidth = 284) {
  const { data, info } = await sharp(path)
    .resize({ width: targetWidth })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const widthBytes = Math.ceil(info.width / 8);
  const bitmap = new Uint8Array(widthBytes * info.height);
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[y * info.width + x] < 128) {
        bitmap[y * widthBytes + (x >> 3)] |= 0x80 >> (x % 8);
      }
    }
  }
  return { bitmap, widthBytes, height: info.height };
}

function imageCommands(bitmap: Uint8Array, widthBytes: number, height: number): number[] {
  const xL = widthBytes & 0xff, xH = (widthBytes >> 8) & 0xff;
  const yL = height & 0xff, yH = (height >> 8) & 0xff;
  return [GS, 0x76, 0x30, 0x00, xL, xH, yL, yH, ...bitmap];
}

// updated to include a logo
async function buildReceipt(lines: ReceiptLine[]): Promise<Uint8Array<ArrayBufferLike>> {
  const bytes: number[] = [...INIT];
  ...
  const logo = await loadImage("../aha-logo-horizontal-greyscale.png");
  bytes.push(...ALIGN_CENTER);
  bytes.push(...imageCommands(logo.bitmap, logo.widthBytes, logo.height));
  bytes.push(...new TextEncoder().encode("\n\n\n"));
  bytes.push(...ALIGN_LEFT);

  bytes.push(...CUT);
  return new Uint8Array(bytes);
}
```

And then that image byte array can be pushed onto the collection of bytes to be sent to `device.transferOut`, et voilà!

I now have a receipt showing all of the transactions from my demo:
- a `create_account` transaction that creates an account with a starting balance of 2 XLM
- a `set_options` transaction that adds a cosigner to the account
- a `payment` transaction to send XLM from the new account back to the cosigner

<img src="/assets/blog-post-assets/2026-08-11/IMG_4344.png" alt="create_account receipt" width="50%"/>
<img src="/assets/blog-post-assets/2026-08-11/IMG_4345.png" alt="set_options receipt" width="50%"/>
<img src="/assets/blog-post-assets/2026-08-11/IMG_4346.png" alt="payment receipt" width="50%"/>


It is satisfying to hold a paper receipt for a transaction that, moments earlier, existed only as bytes on a blockchain — a strange little bridge between a decades-old piece of hardware and a system that is still evolving and figuring out what it wants to be. Next up: printing receipts at Meridian. I'm still noodling on exactly what that looks like, but there's something fun about dragging this little printer into a room full of blockchain people and handing them a receipt for something that just happened.

<img src="/assets/blog-post-assets/2026-08-11/full-receipt-edited.gif" alt="gif of the full receipt being printed" width="50%"/>