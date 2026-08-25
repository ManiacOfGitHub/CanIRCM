document.getElementById("form").style.display = "block";
document.getElementById("form").addEventListener("submit",(event)=>{
    event.preventDefault();
    var serial = document.getElementById("serial").value.toUpperCase().replaceAll(" ","");

    var result = checkSerial(serial);
    var outputs = {
        mariko: `seems to be a "mariko" Switch, Switch Lite, or Switch OLED.\nThese are currently not hackable via software, only hardware modifications that involve soldering modchips.<br><br>You can find a list of hardmodders trusted by the community <a href="https://nintendohomebrew.com/hardmodders">here</a>. When requesting their services, please make sure to specify your console model (Switch v2, Switch OLED, Switch Lite) after reviewing the diagram below:`,
        switch2: `seems to be a Switch 2. These are currently not hackable.`,
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

function checkSerial(serial) {
    document.getElementById("modelTable").style.display = "none";
    if(serial.length != 14) return "invalid";
    if(!serial.match("XA[JKW][1479][0-9]{6}")) {
        if(serial.match("X[KJWT][JWCE][0-9]{7}")) {
            document.getElementById("modelTable").style.display = "block";
            return "mariko";
        } else if(serial.match("HA[JKWE][0-9]{7}")) {
            return "switch2";
        } else {
            return "invalid";
        }
    }

    var region = serial[2];
    var assemblyLine = parseInt(serial[3]);
    var checkingValue = parseInt(serial.slice(3,10));

    var maxSafe = {
        "W": {
            1: {unpatched: 1006500, maybe: 1012000},
            4: {unpatched: 4001100, maybe: 4001300},
            7: {unpatched: 7001750, maybe: 7003000}
        },
        "J": {
            1: {unpatched: 1002000, maybe: 1003000},
            4: {unpatched: 4004400, maybe: 4008300},
            7: {unpatched: 7004000, maybe: 7005000}
        }
    }
    if(region == "K") return "maybe";
    if(assemblyLine == 9) return "maybe";
    if(checkingValue < maxSafe[region][assemblyLine].unpatched) {
        return "unpatched";
    } else if(checkingValue < maxSafe[region][assemblyLine].maybe) {
        return "maybe";
    } else {
        return "patched";
    }
}
