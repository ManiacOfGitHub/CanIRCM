var serialData;
(async()=>{
    try {
        serialData = await (await fetch("https://nintendohomebrew.com/assets/switch_serial_data.json")).json();
        document.getElementById("form").style.display = "block";
    } catch(err) {
        document.getElementById("outputMessage").innerHTML = "Failed to load serial data. Please reload the page.";
        document.getElementById("output").style.display = "block";
    }
})();
document.getElementById("form").addEventListener("submit",async(event)=>{
    event.preventDefault();
    var serial = document.getElementById("serial").value.toUpperCase().replaceAll(" ","");

    var result = await checkSerial(serial);
    if(!result) return;
    var outputs = {
        mariko: `seems to be a "mariko" Switch, Switch Lite, or Switch OLED.\nThese are currently not hackable via software, only hardware modifications that involve soldering modchips.<br><br>You can find a list of hardmodders trusted by the community <a href="https://nintendohomebrew.com/hardmodders">here</a>. When requesting their services, please make sure to specify your console model (Switch v2, Switch OLED, Switch Lite) after reviewing the diagram below:`,
        switch2: `seems to be a Switch 2. This tool cannot determine if they are hackable.`,
        maybe: `<i>might</i> be patched. The only way you can know this for sure is by pushing the payload manually. You can find instructions to do so <a href="https://switch.hacks.guide/user_guide/rcm/sending_payload.html">here</a>.<br>If you find out the console is patched, then that means the console is not hackable with software, only hardware modifications that involve soldering modchips.<br><br>You can find a list of hardmodders trusted by the community <a href="https://nintendohomebrew.com/hardmodders">here</a>. When requesting their services, please make sure to specify that your console model is a patched Erista (v1) Switch.`,
        patched: `is patched. It is not hackable via software, only hardware modifications that involve soldering modchips.<br><br>You can find a list of hardmodders trusted by the community <a href="https://nintendohomebrew.com/hardmodders">here</a>. When requesting their services, please make sure to specify that your console model is a patched Erista (v1) Switch.`,
        unpatched: `is not patched. <a href="https://switch.hacks.guide/user_guide/rcm/sending_payload.html">Continue to the written guide</a>.`,
        invalid: `is invalid. Please make sure you typed it correctly.`
    };
    var finalOutput = outputs[result];
    if(result == "unpatched") {
        document.getElementById("outputAlert").className = "alert alert-success";
    } else if(result == "maybe") {
        document.getElementById("outputAlert").className = "alert alert-warning";
    } else {
        document.getElementById("outputAlert").className = "alert alert-danger";
    }
    document.getElementById("serialOutput").innerText = serial;
    document.getElementById("outputMessage").innerHTML = finalOutput;
    document.getElementById("output").style.display = "block";
})

async function checkSerial(serial) {
    document.getElementById("modelTable").style.display = "none";
    if(serial.length != 14) {
        var stupidCheck = checkSerialButReallyStupid(serial);
        if(stupidCheck) return;
        return "invalid";
    }
    if(!serial.match(serialData.regex.valid)) {
        if(serial.match(serialData.regex.mariko)) {
            document.getElementById("modelTable").style.display = "block";
            return "mariko";
        } else if(serial.match(serialData.regex.switch2)) {
            return "switch2";
        } else {
            var stupidCheck = checkSerialButReallyStupid(serial);
            if(stupidCheck) return;
            return "invalid";
        }
    }

    var checkingValue = parseInt(serial.slice(3,10));
    for(var prefix in serialData.prefixes) {
        if(serial.startsWith(prefix)) {
            if(checkingValue < serialData.prefixes[prefix].unpatched) {
                return "unpatched";
            } else if(checkingValue < serialData.prefixes[prefix].maybe) {
                return "maybe";
            } else {
                return "patched";
            }
        }
    }
}


// Nothing under this line matters, it's all for lols.

function checkSerialButReallyStupid(serial) {
    // 3DS goes first before the other nonsense.
    if(serial.match(/^[CESRAPYQN](?:JE|JF|JH|JM|W|B|S|EE|EF|EH|EM|AF|AH|AG|AM|KF|KH|KM|CF|CH|CM)[0-9]{9}$/)) {
        document.getElementById("serialOutput").innerText = serial;
        document.getElementById("outputMessage").innerHTML = `is a console within the Nintendo 3DS family of systems. Did you know it's surprisingly easy to mod?<br><br><p class="text-center"><a href="https://3ds.hacks.guide"><img style="max-width: 100%;" src="img/3ds.jpeg"></a></p>`;
        document.getElementById("output").style.display = "block";
        document.getElementById("outputAlert").className = "alert alert-primary";
        return true;
    }

    if(serial.match("X[A-Z][JWCEL][0-9]{7}") && serial.length == 14) {
        var products = {
            "B": "Left Joy-Con",
            "C": "Right Joy-Con",
            "D": "Joy-Con charge grip",
            "E": "Pro Controller",
            "F": "Dock",
            "H": "Pok\u00e9 Ball Plus controller",
            "L": "Left NES controller",
            "M": "Right NES controller",
            "N": "Left Famicom controller",
            "P": "Right Famicom controller",
            "Q": "Kart for \"Mario Kart Live: Home Circuit\"",
            "R": "SNES controller",
            "S": "N64 controller",
            "X": "Sega Genesis controller",
            "Y": "RelayBox",
            "Z": "SDEV cradle"
        };
        if(products.hasOwnProperty(serial[1])) {
            document.getElementById("serialOutput").innerText = serial;
            document.getElementById("outputMessage").innerHTML = `is a ${products[serial[1]]}. I would venture to guess that it is not vulnerable to fusee-gelee. Just a hunch.`
            document.getElementById("output").style.display = "block";
            document.getElementById("outputAlert").className = "alert alert-secondary";
            return true;
        }
    }
    return false;
}