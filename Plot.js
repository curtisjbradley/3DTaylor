





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



    document.getElementById("approximation").innerText = taylortext;
    const dataOriginal = {
        opacity: 0.8,
        color: 'rgb(300,100,200)',
        type: 'mesh3d',
        x: a,
        y: b,
        z: c, // 'c' represents the z-values of the original function
    };

    // Define your mesh data for the Taylor approximation
    const dataTaylor = {
        opacity: 0.8,
        color: 'rgb(100,100,200)',
        type: 'mesh3d',
        x: a,
        y: b,
        z: taylorz,
    };
    const dataTaylorCenter = {
        type: 'scatter3d', // Scatter plot in 3D
        mode: 'markers',  // Markers only
        x: [taylorx],
        y: [taylory],     // Taylor series expansion y-coordinate
        z: [taylorEquation.evaluate({ x: taylorx, y: taylory })], // Corresponding z-coordinate
        marker: {
            color: 'red', // Color of the marker
            size: 10,      // Size of the marker
        },
        name: 'Taylor Expansion Center' // Name for the legend
    };

    var data = [dataOriginal, dataTaylor,dataTaylorCenter];

    var layout = {
        title: 'Function and Taylor Approximation',
        scene: {
            xaxis: { title: 'X Axis' },
            yaxis: { title: 'Y Axis' },
            zaxis: { title: 'Z Axis' },
        },
        automargin: true,
        height:750
    };

    // Create a single plot with both datasets
    Plotly.newPlot('plotreg', data, layout);

}

function nthDer(equ, variable, n){
    if(n <= 0) return equ;
    return nthDer(math.derivative(equ,variable).toString(),variable,n-1);
}
