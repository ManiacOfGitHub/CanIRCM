document.getElementById("form").style.display = "block";
document.getElementById("form").addEventListener("submit",(event)=>{
    event.preventDefault();
    var serial = document.getElementById("serial").value.toUpperCase().replaceAll(" ","");

    var result = checkSerial(serial);
    var outputs = {
        mariko: `seems to be a "mariko" Switch or Switch Lite.\nThese are currently not hackable via software, only hardware modifications that involve soldering modchips. You can find a list of hardmodders trusted by the community <a href="https://nintendohomebrew.com/hardmodders">here</a>.`,
        switch2: `seems to be a Switch 2. These are currently not hackable.`,
        maybe: `<i>might</i> be patched. The only way you can know this for sure is by pushing the payload manually. You can find instructions to do so <a href="https://switch.hacks.guide/user_guide/rcm/sending_payload.html">here</a>.`,
        patched: `is patched. It is not hackable via software, only hardware modifications that involve soldering modchips. You can find a list of hardmodders trusted by the community <a href="https://nintendohomebrew.com/hardmodders">here</a>.`,
        unpatched: `is not patched. <a href="https://switch.hacks.guide/user_guide/rcm/sending_payload.html">Continue to the written guide</a>.`,
        invalid: `is invalid. Please make sure you typed it correctly. If you did, <a href="https://github.com/ManiacOfGitHub/CanIRCM/issues/new">make an issue on the GitHub repo</a>.`
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
    if(serial.length != 14) return "invalid";
    if(!serial.match("XA[JKW][1479][0-9]{6}")) {
        if(serial.match("X[KJWT][JWCE][0-9]{7}")) {
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
            1: {unpatched: 1007400, maybe: 1012000},
            4: {unpatched: 4001100, maybe: 4001200},
            7: {unpatched: 7001780, maybe: 7003000}
        },
        "J": {
            1: {unpatched: 1002000, maybe: 1003000},
            4: {unpatched: 4004600, maybe: 4006000},
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