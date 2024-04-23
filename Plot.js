





//window.addEventListener( 'resize', onWindowResize );
function onWindowResize(){
    const plotElement = document.getElementById("plot");
    plotElement.style.height = window.innerHeight + 'px';
    plotElement.style.width = window.innerWidth + 'px';
}

function  plotRandom(){
    const xymin = parseFloat(document.getElementById("xymin").value);
    const xymax = parseFloat(document.getElementById("xymax").value);
    const xystep = parseFloat(document.getElementById("step").value);
    a=[]; b=[]; c=[];
    for (let i = xymin; i < xymax; i += xystep) {
        for (let j = xymin; j < xymax; j += xystep) {
            a.push(i);
            b.push(j);
        }

    }
    const equationText = document.getElementById("formula").value
    var equation =  math.compile(equationText);

    for(let i = 0; i < a.length; i++) {
        var x = a[i];
        var y = b[i];
        let scope = {x:x,y:y}
        c.push(equation.evaluate(scope));
    }



// Plotting the mesh
    var data=[
        {
            opacity:0.8,
            color:'rgb(300,100,200)',
            type: 'mesh3d',
            x: a,
            y: b,
            z: c,
        }
    ];
    let equations = [];
    const taylorx = parseFloat(document.getElementById('taylorx').value)
    const taylory = parseFloat(document.getElementById('taylory').value)
    const taylorn = parseInt(document.getElementById('taylorn').value)
    for(let n = 0; n <= taylorn; n++) {
        for (let r = 0; r <= n; r++) {
            const co = math.compile("1/(" + r + "!* "+ (n-r)+"!)").evaluate()
            equations.push(co +"* " + math.compile(nthDer(nthDer(equationText,'x',r),'y',n-r)).evaluate({x:taylorx,y:taylory})+"*(x-"+taylorx+")^" + r + "* (y - " + taylory + ") ^" + (n-r))
        }
    }
    let taylortext = "";
    for (let i = 0; i < equations.length; i++) {
        taylortext += equations[i];
        if(i !== equations.length -1){
         taylortext += "+"
        }
    }
    let taylorz = [];
    let taylorEquation = math.compile(taylortext);
    for(let i = 0; i < a.length; i++) {
        var x = a[i];
        var y = b[i];
        let scope = {x:x,y:y}

        taylorz.push(taylorEquation.evaluate(scope));
    }



    var taylor=[
        {
            opacity:0.8,
            color:'rgb(100,100,200)',
            type: 'mesh3d',
            x: a,
            y: b,
            z: taylorz,
        }
    ];


    document.getElementById("approximation").innerText = taylortext;
    Plotly.newPlot('plotreg', data,{title:"Function"});
    Plotly.newPlot('plottaylor', taylor,{title:"Taylor Approximation"});
}

function nthDer(equ, variable, n){
    if(n <= 0) return equ;
    return nthDer(math.derivative(equ,variable).toString(),variable,n-1);
}
