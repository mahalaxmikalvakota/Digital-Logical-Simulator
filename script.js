function generate() {
    let values = [
        document.getElementById("o0").value,
        document.getElementById("o1").value,
        document.getElementById("o2").value,
        document.getElementById("o3").value
    ];

    let terms = [];

    if (values[0] == 1) terms.push("A'B'");
    if (values[1] == 1) terms.push("A'B");
    if (values[2] == 1) terms.push("AB'");
    if (values[3] == 1) terms.push("AB");

    let expr = terms.join(" + ");
    document.getElementById("expression").innerText = expr || "0";

    drawKMap(values);
    simplifyKMap(values);
}

function simulate() {
    let A = document.getElementById("A").checked ? 1 : 0;
    let B = document.getElementById("B").checked ? 1 : 0;

    let AND = A & B;
    let OR = A | B;
    let NOTA = A ? 0 : 1;
    let NAND = !(A & B) ? 1 : 0;
    let NOR = !(A | B) ? 1 : 0;
    let XOR = A ^ B;
    let XNOR = !(A ^ B) ? 1 : 0;

    document.getElementById("output").innerHTML = `
        AND: ${AND} <br>
        OR: ${OR} <br>
        NOT A: ${NOTA} <br>
        NAND: ${NAND} <br>
        NOR: ${NOR} <br>
        XOR: ${XOR} <br>
        XNOR: ${XNOR}
    `;
}

function drawKMap(values) {
    let html = `
        <table>
            <tr><th></th><th>B=0</th><th>B=1</th></tr>
            <tr><th>A=0</th><td>${values[0]}</td><td>${values[1]}</td></tr>
            <tr><th>A=1</th><td>${values[2]}</td><td>${values[3]}</td></tr>
        </table>
    `;
    document.getElementById("kmap").innerHTML = html;
}

function simplifyKMap(v) {

    let simplified = "";

    // ALL 1 → output = 1
    if (v[0] == 1 && v[1] == 1 && v[2] == 1 && v[3] == 1) {
        simplified = "1";
    }

    // AND (AB)
    else if (v[3] == 1 && v[0] == 0 && v[1] == 0 && v[2] == 0) {
        simplified = "AB";
    }

    // OR (A + B)
    else if (v[1] == 1 && v[2] == 1 && v[3] == 1 && v[0] == 0) {
        simplified = "A + B";
    }

    // A only
    else if (v[2] == 1 && v[3] == 1) {
        simplified = "A";
    }

    // B only
    else if (v[1] == 1 && v[3] == 1) {
        simplified = "B";
    }

    // NOT A
    else if (v[0] == 1 && v[1] == 1) {
        simplified = "A'";
    }

    // NOT B
    else if (v[0] == 1 && v[2] == 1) {
        simplified = "B'";
    }

    // XOR (A'B + AB')
    else if (v[1] == 1 && v[2] == 1 && v[0] == 0 && v[3] == 0) {
        simplified = "A'B + AB'";
    }

    else {
        simplified = "Complex";
    }

    // SHOW RESULT
    document.getElementById("expression").innerText +=
        " → Simplified: " + simplified;

    drawCircuit(simplified);
}
function drawCircuit(expr) {

    let svg = document.getElementById("circuit");

    // AND GATE (AB)
    if (expr === "AB") {
        svg.innerHTML = `
            <text x="10" y="40">A</text>
            <line x1="30" y1="40" x2="100" y2="40"/>

            <text x="10" y="80">B</text>
            <line x1="30" y1="80" x2="100" y2="80"/>

            <!-- AND Gate -->
            <rect x="100" y="30" width="60" height="60"/>
            <text x="115" y="65">AND</text>

            <line x1="160" y1="60" x2="250" y2="60"/>
            <text x="260" y="65">OUT</text>
        `;
    }

    // OR GATE (A + B)
    else if (expr === "A+B" || expr === "A + B") {
        svg.innerHTML = `
            <text x="10" y="40">A</text>
            <line x1="30" y1="40" x2="100" y2="40"/>

            <text x="10" y="80">B</text>
            <line x1="30" y1="80" x2="100" y2="80"/>

            <!-- OR Gate -->
            <rect x="100" y="30" width="60" height="60"/>
            <text x="115" y="65">OR</text>

            <line x1="160" y1="60" x2="250" y2="60"/>
            <text x="260" y="65">OUT</text>
        `;
    }

    // NOT GATE (A')
    else if (expr === "A'") {
        svg.innerHTML = `
            <text x="10" y="60">A</text>
            <line x1="30" y1="60" x2="100" y2="60"/>

            <circle cx="110" cy="60" r="6"/>

            <line x1="116" y1="60" x2="200" y2="60"/>
            <text x="210" y="65">OUT</text>
        `;
    }

    // DIRECT CONNECTION (A or B)
    else if (expr === "A" || expr === "B") {
        svg.innerHTML = `
            <text x="10" y="60">${expr}</text>
            <line x1="30" y1="60" x2="200" y2="60"/>
            <text x="210" y="65">OUT</text>
        `;
    }

    else {
        svg.innerHTML = `
            <text x="80" y="80">Complex Circuit</text>
        `;
    }
}